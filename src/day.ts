import { Response } from './index';

export default interface Day {
  main(data: string): Response;
}
