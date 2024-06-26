import { describeBehaviorOfReentrancyGuard } from '@solidstate/spec';
import {
  ReentrancyGuardMock,
  ReentrancyGuardMock__factory,
} from '@solidstate/typechain-types';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('ReentrancyGuard', function () {
  let instance: ReentrancyGuardMock;

  beforeEach(async function () {
    const [deployer] = await ethers.getSigners();
    instance = await new ReentrancyGuardMock__factory(deployer).deploy();
  });

  describeBehaviorOfReentrancyGuard(async () => instance, {});

  describe('__internal', function () {
    describe('nonReentrant modifier', function () {
      it('does not revert non-reentrant call', async function () {
        await expect(instance['nonReentrancyTest()']()).not.to.be.reverted;

        // test subsequent calls

        await expect(instance['nonReentrancyTest()']()).not.to.be.reverted;

        await expect(
          instance['reentrancyTest()'](),
        ).to.be.revertedWithCustomError(
          instance,
          'ReentrancyGuard__ReentrantCall',
        );
      });

      describe('reverts if', function () {
        it('call is reentrant', async function () {
          await expect(
            instance['reentrancyTest()'](),
          ).to.be.revertedWithCustomError(
            instance,
            'ReentrancyGuard__ReentrantCall',
          );
        });

        it('call is cross-function reentrant', async function () {
          await expect(
            instance['crossFunctionReentrancyTest()'](),
          ).to.be.revertedWithCustomError(
            instance,
            'ReentrancyGuard__ReentrantCall',
          );
        });
      });
    });
  });
});
