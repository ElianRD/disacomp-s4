export const rabbitmqConfig = {
  urls: ['amqp://guest:guest@localhost:5672'],
  queue: 'main_queue',
  queueOptions: { durable: false },
};
