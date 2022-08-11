import convention from './convention';
import reviewHandlers from './review';
import template from './template';

export const handlers = [...convention, ...template, ...reviewHandlers];
