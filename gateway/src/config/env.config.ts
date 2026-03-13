export const environment = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  RABBITMQ_QUEUE: process.env.RABBITMQ_QUEUE || 'main_queue',
};
