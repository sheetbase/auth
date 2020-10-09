import {Options} from '../types/auth.type';

export class OptionService {
  private options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  getOptions() {
    return this.options;
  }
}
