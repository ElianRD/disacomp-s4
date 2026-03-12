export const rabbitmqConfig = {
  urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
  queue: process.env.RABBITMQ_QUEUE || 'main_queue',
  queueOptions: { durable: false },
};
