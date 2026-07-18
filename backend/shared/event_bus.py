import json
import logging
import asyncio
from typing import Callable, Dict, Any
import redis.asyncio as aioredis

logger = logging.getLogger("event_bus")

class EventBus:
    def __init__(self, redis_url: str = "redis://localhost:6379/0", stream_name: str = "stadiax_events"):
        self.redis_url = redis_url
        self.stream_name = stream_name
        self.redis = None

    async def connect(self):
        if not self.redis:
            self.redis = await aioredis.from_url(self.redis_url, decode_responses=True)
            logger.info("EventBus connected to Redis.")

    async def disconnect(self):
        if self.redis:
            await self.redis.close()
            self.redis = None
            logger.info("EventBus disconnected.")

    async def publish(self, event_name: str, payload: Dict[str, Any]):
        """Publish an event to the stream."""
        if not self.redis:
            await self.connect()
        
        message = {
            "event_type": event_name,
            "data": json.dumps(payload)
        }
        try:
            msg_id = await self.redis.xadd(self.stream_name, message)
            logger.info(f"Published event '{event_name}' with ID {msg_id}")
            return msg_id
        except Exception as e:
            logger.error(f"Failed to publish event '{event_name}': {e}")
            return None

    async def subscribe(self, group_name: str, consumer_name: str, callback: Callable[[str, Dict[str, Any]], Any]):
        """Subscribe to the stream using a consumer group."""
        if not self.redis:
            await self.connect()

        # Create consumer group if it doesn't exist
        try:
            await self.redis.xgroup_create(self.stream_name, group_name, id="0", mkstream=True)
            logger.info(f"Created consumer group '{group_name}' on stream '{self.stream_name}'.")
        except aioredis.exceptions.ResponseError as e:
            if "BUSYGROUP" in str(e):
                logger.debug(f"Consumer group '{group_name}' already exists.")
            else:
                logger.error(f"Error creating consumer group: {e}")
                raise

        # Spawn reader loop
        asyncio.create_task(self._reader_loop(group_name, consumer_name, callback))

    async def _reader_loop(self, group_name: str, consumer_name: str, callback: Callable[[str, Dict[str, Any]], Any]):
        logger.info(f"Started subscriber loop for group '{group_name}' (consumer: '{consumer_name}')")
        
        while True:
            try:
                if not self.redis:
                    await self.connect()

                # Read new messages (">" means messages not delivered to other consumers in group)
                streams = {self.stream_name: ">"}
                messages = await self.redis.xreadgroup(
                    groupname=group_name,
                    consumername=consumer_name,
                    streams=streams,
                    count=5,
                    block=1000
                )

                if not messages:
                    await asyncio.sleep(0.5)
                    continue

                for stream, msg_list in messages:
                    for msg_id, fields in msg_list:
                        event_type = fields.get("event_type", "unknown")
                        data_str = fields.get("data", "{}")
                        try:
                            payload = json.loads(data_str)
                            # Invoke callback
                            if asyncio.iscoroutinefunction(callback):
                                await callback(event_type, payload)
                            else:
                                callback(event_type, payload)
                            
                            # Acknowledge message
                            await self.redis.xack(self.stream_name, group_name, msg_id)
                        except Exception as inner_e:
                            logger.error(f"Error processing message {msg_id}: {inner_e}")
            
            except asyncio.CancelledError:
                logger.info(f"Reader loop cancelled for group '{group_name}'.")
                break
            except Exception as e:
                logger.error(f"Error in EventBus reader loop: {e}")
                await asyncio.sleep(2)  # Backoff before retry
