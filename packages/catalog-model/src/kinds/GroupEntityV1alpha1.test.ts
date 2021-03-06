/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  GroupEntityV1alpha1,
  groupEntityV1alpha1Policy as policy,
} from './GroupEntityV1alpha1';

describe('GroupV1alpha1Policy', () => {
  let entity: GroupEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        name: 'doe-squad',
        title: 'Doe Squad',
        description: 'A squad for John and Jane',
      },
      spec: {
        type: 'squad',
        parent: 'group-a',
        ancestors: ['group-a', 'global-synergies', 'acme-corp'],
        children: ['child-a', 'child-b'],
        descendants: ['desc-a', 'desc-b'],
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('silently accepts v1beta1 as well', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta1';
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('ignores unknown apiVersion', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta0';
    await expect(policy.enforce(entity)).resolves.toBeUndefined();
  });

  it('ignores unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    await expect(policy.enforce(entity)).resolves.toBeUndefined();
  });

  it('rejects missing type', async () => {
    delete (entity as any).spec.type;
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  it('rejects wrong type', async () => {
    (entity as any).spec.type = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  it('accepts missing parent', async () => {
    delete (entity as any).spec.parent;
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects empty parent', async () => {
    (entity as any).spec.parent = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/parent/);
  });

  it('rejects missing ancestors', async () => {
    delete (entity as any).spec.ancestors;
    await expect(policy.enforce(entity)).rejects.toThrow(/ancestor/);
  });

  it('rejects empty ancestors', async () => {
    (entity as any).spec.ancestors = [''];
    await expect(policy.enforce(entity)).rejects.toThrow(/ancestor/);
  });

  it('rejects undefined ancestors', async () => {
    (entity as any).spec.ancestors = [undefined];
    await expect(policy.enforce(entity)).rejects.toThrow(/ancestor/);
  });

  it('accepts no ancestors', async () => {
    (entity as any).spec.ancestors = [];
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects missing children', async () => {
    delete (entity as any).spec.children;
    await expect(policy.enforce(entity)).rejects.toThrow(/children/);
  });

  it('rejects empty children', async () => {
    (entity as any).spec.children = [''];
    await expect(policy.enforce(entity)).rejects.toThrow(/children/);
  });

  it('rejects undefined children', async () => {
    (entity as any).spec.children = [undefined];
    await expect(policy.enforce(entity)).rejects.toThrow(/children/);
  });

  it('accepts no children', async () => {
    (entity as any).spec.children = [];
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects missing descendants', async () => {
    delete (entity as any).spec.descendants;
    await expect(policy.enforce(entity)).rejects.toThrow(/descendants/);
  });

  it('rejects empty descendants', async () => {
    (entity as any).spec.descendants = [''];
    await expect(policy.enforce(entity)).rejects.toThrow(/descendants/);
  });

  it('rejects undefined descendants', async () => {
    (entity as any).spec.descendants = [undefined];
    await expect(policy.enforce(entity)).rejects.toThrow(/descendants/);
  });

  it('accepts no descendants', async () => {
    (entity as any).spec.descendants = [];
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });
});
