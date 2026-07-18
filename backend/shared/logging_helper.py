import logging
import json
import time
import sys
from typing import Any

class JsonFormatter(logging.Formatter):
    def __init__(self, service_name: str):
        super().__init__()
        self.service_name = service_name

    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "service": self.service_name,
            "module": record.module,
            "line": record.lineno,
            "message": record.getMessage()
        }
        
        # Capture tracebacks
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_data)

def setup_logging(service_name: str, level: int = logging.INFO):
    root = logging.getLogger()
    root.setLevel(level)

    # Output to standard output
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)
    
    formatter = JsonFormatter(service_name)
    handler.setFormatter(formatter)
    
    # Avoid duplicate handlers
    if root.hasHandlers():
        root.handlers.clear()
        
    root.addHandler(handler)
    
    # Disable default uvicorn format overrides
    logging.getLogger("uvicorn.access").propagate = True
    logging.getLogger("uvicorn.error").propagate = True
    
    logging.info(f"Structured logging initialized for service '{service_name}'")
