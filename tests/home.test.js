import { describe, expect, it } from 'vitest';
import { recommend } from '../src/lib/recommend.js';

describe('homepage recommendation', () => {
  it('maps usage to a package and never returns prices', () => {
    expect(recommend({ usage: 'low' }).id).toBe('start');
    expect(recommend({ usage: 'mid' }).id).toBe('popular');
    expect(recommend({ usage: 'mid', battery: true }).id).toBe('hybrid');
    expect(recommend({ usage: 'high' }).id).toBe('pro');
    expect(recommend({ usage: 'xl', site: 'business' }).id).toBe('business');
    expect(recommend({ usage: 'mid' })).not.toHaveProperty('price');
  });
});
