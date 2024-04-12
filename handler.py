import logging

# Setup our logger to work both locally and with both AWS CloudWatch
if len(logging.getLogger().handlers) > 0:
    logging.getLogger().setLevel(logging.INFO)
else:
    logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()


def hello(event, context):
    logger.info(f"Hello World: {event}")