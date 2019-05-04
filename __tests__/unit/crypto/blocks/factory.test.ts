import "jest-extended";

import { Block, BlockFactory } from "../../../../packages/crypto/src/blocks";
import { IBlockData, IBlockJson } from "../../../../packages/crypto/src/interfaces";
import { configManager } from "../../../../packages/crypto/src/managers";
import { dummyBlock } from "../fixtures/block";

const expectBlock = ({ data }: { data: IBlockData }) => {
    delete data.idHex;

    const blockWithoutTransactions: IBlockData = { ...dummyBlock };
    blockWithoutTransactions.reward = blockWithoutTransactions.reward;
    blockWithoutTransactions.totalAmount = blockWithoutTransactions.totalAmount;
    blockWithoutTransactions.totalFee = blockWithoutTransactions.totalFee;
    delete blockWithoutTransactions.transactions;

    expect(data).toEqual(blockWithoutTransactions);
};

beforeEach(() => configManager.setFromPreset("devnet"));

describe("BlockFactory", () => {
    describe(".fromHex", () => {
        it("should create a block instance from hex", () => {
            expectBlock(BlockFactory.fromHex(Block.serializeWithTransactions(dummyBlock).toString("hex")));
        });
    });

    describe(".fromBytes", () => {
        it("should create a block instance from a buffer", () => {
            expectBlock(BlockFactory.fromBytes(Block.serializeWithTransactions(dummyBlock)));
        });
    });

    describe(".fromData", () => {
        it("should create a block instance from an object", () => {
            expectBlock(BlockFactory.fromData(dummyBlock));
        });
    });

    describe(".fromJson", () => {
        it("should create a block instance from JSON", () => {
            expectBlock(BlockFactory.fromJson(BlockFactory.fromData(dummyBlock).toJson()));
        });

        it("should create a block instance from JSON and memoize the result", () => {
            const spyFromData: jest.SpyInstance = jest.spyOn(BlockFactory, "fromData");

            const dummy: IBlockJson = BlockFactory.fromData(dummyBlock).toJson();

            for (let i = 0; i < 5; i++) {
                expectBlock(BlockFactory.fromJson(dummy));
            }

            expect(spyFromData).toHaveBeenCalledTimes(1);

            spyFromData.mockReset();
        });
    });
});
