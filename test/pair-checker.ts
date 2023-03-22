import { expect } from "chai";
import { ethers } from "hardhat";
import keccak256 from "keccak256";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import * as mocha from "mocha-steps";
import { parseEther } from '@ethersproject/units';
import { IRouter, IToken, IFactory } from '../typechain-types';
import addresses from '../routers.json'

describe("PAIR CHECKER", function () {

    let sushi: IRouter;
    let pancake: IRouter;
    let bi: IRouter;
    let mdex: IRouter;
    let ape: IRouter;
    let baby: IRouter;
    let nomi: IRouter;
    let knight: IRouter;
    let bakery: IRouter;

    let sushiFactory: IFactory;
    let pancakeFactory: IFactory;
    let biFactory: IFactory;
    let mdexFactory: IFactory;
    let apeFactory: IFactory;
    let babyFactory: IFactory;
    let nomiFactory: IFactory;
    let knightFactory: IFactory;
    let bakeryFactory: IFactory;

    const token0 = addresses.bsc.busd;
    const token1 = addresses.bsc.btcb;
    
    mocha.step("Router Initialization", async function() {
        sushi = await ethers.getContractAt("IRouter", addresses.bsc.sushiswap);
        pancake = await ethers.getContractAt("IRouter", addresses.bsc.pancakeswap);
        bi = await ethers.getContractAt("IRouter", addresses.bsc.biswap);
        mdex = await ethers.getContractAt("IRouter", addresses.bsc.mdex);
        ape = await ethers.getContractAt("IRouter", addresses.bsc.apeswap);
        baby = await ethers.getContractAt("IRouter", addresses.bsc.babyswap);
        nomi = await ethers.getContractAt("IRouter", addresses.bsc.nomiswap);
        knight = await ethers.getContractAt("IRouter", addresses.bsc.knightswap);
        bakery = await ethers.getContractAt("IRouter", addresses.bsc.bakeryswap);
    });

    mocha.step("Factory Initialization", async function () {
        sushiFactory = await ethers.getContractAt("IFactory", (await sushi.factory()));
        pancakeFactory = await ethers.getContractAt("IFactory", (await pancake.factory()));
        biFactory = await ethers.getContractAt("IFactory", (await bi.factory()));
        mdexFactory = await ethers.getContractAt("IFactory", (await mdex.factory()));
        apeFactory = await ethers.getContractAt("IFactory", (await ape.factory()));
        babyFactory = await ethers.getContractAt("IFactory", (await baby.factory()));
        nomiFactory = await ethers.getContractAt("IFactory", (await nomi.factory()));
        knightFactory = await ethers.getContractAt("IFactory", (await knight.factory()));
        bakeryFactory = await ethers.getContractAt("IFactory", (await bakery.factory()));
    });

    mocha.step("Check", async function () {
        const sushiPair = await sushiFactory.getPair(token0, token1);
        console.log('Sushi Pair', sushiPair);
        const pancakePair = await pancakeFactory.getPair(token0, token1);
        console.log('Pancake Pair', pancakePair);
        const biPair = await biFactory.getPair(token0, token1);
        console.log('Bi Pair', biPair);
        const mdexPair = await mdexFactory.getPair(token0, token1);
        console.log('Mdex Pair', mdexPair);
        const apePair = await apeFactory.getPair(token0, token1);
        console.log('Ape Pair', apePair);
        const babyPair = await babyFactory.getPair(token0, token1);
        console.log('Baby Pair', babyPair);
        const nomiPair = await nomiFactory.getPair(token0, token1);
        console.log('Nomi Pair', nomiPair);
        const knightPair = await knightFactory.getPair(token0, token1);
        console.log('Knight Pair', knightPair);
        const bakeryPair = await bakeryFactory.getPair(token0, token1);
        console.log('Bakery Pair', bakeryPair);
    });

    // mocha.step("", async function () {
    // });

});