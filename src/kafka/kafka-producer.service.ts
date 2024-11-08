import { Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { KafkaConfigService } from './kafka.config.service';
import { SendMessageReqDto } from '../app.dts';

@Injectable()
export class KafkaProducerService {
  private readonly producer: Producer;

  constructor(private kafkaConfigService: KafkaConfigService) {
    this.producer = this.kafkaConfigService.getClient().producer();
    this.producer.connect();
  }

  async sendMessage(dto: SendMessageReqDto) {
    const { topic, message } = dto;

    try {
      await this.producer.send({
        topic,
        messages: [{ value: message }],
      });
      console.log(`Message sent to ${topic}: ${message}`);
    } catch (error) {
      console.error(`Error sending message to Kafka: ${error.message}`);
    }
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}