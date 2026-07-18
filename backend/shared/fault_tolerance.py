import time
import asyncio
import logging
from typing import Callable, Any, Dict
from functools import wraps

logger = logging.getLogger("fault_tolerance")

class CircuitBreakerOpenException(Exception):
    pass

class CircuitBreaker:
    def __init__(self, name: str, max_failures: int = 3, recovery_timeout: float = 10.0):
        self.name = name
        self.max_failures = max_failures
        self.recovery_timeout = recovery_timeout
        self.state = "CLOSED"  # CLOSED, OPEN, HALF-OPEN
        self.failure_count = 0
        self.last_state_change = time.time()

    def record_success(self):
        self.failure_count = 0
        if self.state != "CLOSED":
            logger.info(f"Circuit Breaker '{self.name}' closed (recovered).")
            self.state = "CLOSED"
        self.last_state_change = time.time()

    def record_failure(self):
        self.failure_count += 1
        logger.warning(f"Circuit Breaker '{self.name}' failure recorded ({self.failure_count}/{self.max_failures}).")
        if self.failure_count >= self.max_failures and self.state != "OPEN":
            logger.error(f"Circuit Breaker '{self.name}' tripped OPEN.")
            self.state = "OPEN"
            self.last_state_change = time.time()

    def check_state(self):
        if self.state == "OPEN":
            # Check if recovery timeout has passed
            if time.time() - self.last_state_change > self.recovery_timeout:
                logger.info(f"Circuit Breaker '{self.name}' entered HALF-OPEN state (testing).")
                self.state = "HALF-OPEN"
                self.last_state_change = time.time()
            else:
                raise CircuitBreakerOpenException(f"Circuit breaker '{self.name}' is OPEN. Request blocked.")

def circuit_breaker(cb_instance: CircuitBreaker, fallback_func: Callable[..., Any] = None):
    """Decorator to apply Circuit Breaker pattern to async functions."""
    def decorator(func: Callable[..., Any]):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                cb_instance.check_state()
            except CircuitBreakerOpenException as cb_exc:
                if fallback_func:
                    logger.warning(f"Circuit '{cb_instance.name}' is OPEN. Invoking fallback.")
                    if asyncio.iscoroutinefunction(fallback_func):
                        return await fallback_func(*args, **kwargs)
                    return fallback_func(*args, **kwargs)
                raise cb_exc

            try:
                result = await func(*args, **kwargs)
                cb_instance.record_success()
                return result
            except Exception as e:
                logger.error(f"Error executing function '{func.__name__}' under Circuit Breaker: {e}")
                cb_instance.record_failure()
                if fallback_func:
                    logger.warning(f"Execution failed. Invoking fallback.")
                    if asyncio.iscoroutinefunction(fallback_func):
                        return await fallback_func(*args, **kwargs)
                    return fallback_func(*args, **kwargs)
                raise e
        return wrapper
    return decorator
