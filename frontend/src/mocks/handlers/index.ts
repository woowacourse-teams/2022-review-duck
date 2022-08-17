import authHandlers from './auth';
import convention from './convention';
import reviewHandlers from './review';
import template from './template';

export const handlers = [...convention, ...authHandlers, ...template, ...reviewHandlers];
