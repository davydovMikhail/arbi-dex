import { expect } from "chai";
import { ethers } from "hardhat";
import keccak256 from "keccak256";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import * as mocha from "mocha-steps";
import { parseEther } from '@ethersproject/units';
import { IRouter, IToken } from '../../typechain-types';
import addresses from '../../routers.json'

describe("USDC -- WBTC", function () {

    let bnbSource: SignerWithAddress;
    let usdSource: SignerWithAddress;
    let wbnbRecipient: SignerWithAddress;
    let wbnbRecipient2: SignerWithAddress;

    async function getCurrentTime() {
        let blockNumber = await ethers.provider.getBlockNumber();
        let block = await ethers.provider.getBlock(blockNumber);
        return block.timestamp + 240;
    }

    const divider = '1000000000000000000' 

    const pathes = {
        usdcToBtcb: [
            addresses.bsc.usdc,
            addresses.bsc.btcb
        ],
        btcbToUsdc: [
            addresses.bsc.btcb,
            addresses.bsc.usdc
        ],
        wethToUsdc: [
            addresses.bsc.weth,
            addresses.bsc.usdc
        ]
    }

    let sushi: IRouter;
    let pancake: IRouter;
    let bi: IRouter;
    let mdex: IRouter;
    let ape: IRouter;
    let baby: IRouter;
    let nomi: IRouter;
    let knight: IRouter;
    let bakery: IRouter;

    let USDC: IToken;
    let BTCB: IToken;

    beforeEach(async () => {
        [bnbSource, usdSource, wbnbRecipient, wbnbRecipient2] = await ethers.getSigners();
    });

    mocha.step("Tokens Initialization", async function() {
        USDC = await ethers.getContractAt("IToken", addresses.bsc.usdc);
        BTCB = await ethers.getContractAt("IToken", addresses.bsc.btcb);
    });
    
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
    
    mocha.step("Buying USDC", async function() {
        const amountIn = parseEther("100");
        const timestamp = await getCurrentTime();
        await pancake.swapExactETHForTokens(0, pathes.wethToUsdc, usdSource.address, timestamp + 60, {value: amountIn});
        const usdcBal = await USDC.balanceOf(usdSource.address);
        console.log('usdcBal', usdcBal.div(divider));
    });

    mocha.step("Checking usdc amount for each DEX", async function() {
        const amountIn = ethers.utils.parseUnits('100', 18);
        const path = pathes.usdcToBtcb;

        // const sushiAmounts = await sushi.getAmountsOut(amountIn, path);
        // console.log("sushi", sushiAmounts[1]);

        const pancakeAmounts = await pancake.getAmountsOut(amountIn, path);
        console.log("pancake", pancakeAmounts[1]);

        const biAmounts = await bi.getAmountsOut(amountIn, path);
        console.log("bi", biAmounts[1]);

        // const mdexAmounts = await mdex.getAmountsOut(amountIn, path);
        // console.log("mdex", mdexAmounts[1]);

        // const apeAmounts = await ape.getAmountsOut(amountIn, path);
        // console.log("ape", apeAmounts[1]);

        const babyAmounts = await baby.getAmountsOut(amountIn, path);
        console.log("baby", babyAmounts[1]);

        // const nomiAmounts = await nomi.getAmountsOut(amountIn, path);
        // console.log("nomi", nomiAmounts[1]);

        // const knightAmounts = await knight.getAmountsOut(amountIn, path);
        // console.log("knight", knightAmounts[1]);

        // const bakeryAmounts = await bakery.getAmountsOut(amountIn, path);
        // console.log("bakery", bakeryAmounts[1]);

    });

    mocha.step("покупка на 100 usdc weth в разных обмениках", async function() {
        const amountInUSDC = ethers.utils.parseUnits('100', 18);
        const timestamp = (await getCurrentTime()) + 60;


        // await USDC.connect(usdSource).approve(sushi.address, amountInUSDC);
        // await sushi.connect(usdSource).swapExactTokensForTokens(
        //     amountInUSDC,
        //     0,
        //     pathes.usdcToBtcb,
        //     wbnbRecipient2.address,
        //     timestamp
        // );
        // const sushiBal = await BTCB.balanceOf(wbnbRecipient2.address);
        // console.log("sushi", sushiBal);

        await USDC.connect(usdSource).approve(pancake.address, amountInUSDC);
        await pancake.connect(usdSource).swapExactTokensForTokens(
            amountInUSDC,
            0,
            pathes.usdcToBtcb,
            wbnbRecipient2.address,
            timestamp
        );
        const pancakeBal = (await BTCB.balanceOf(wbnbRecipient2.address));
        console.log("pancake", pancakeBal);

        await USDC.connect(usdSource).approve(bi.address, amountInUSDC);
        await bi.connect(usdSource).swapExactTokensForTokens(
            amountInUSDC,
            0,
            pathes.usdcToBtcb,
            wbnbRecipient2.address,
            timestamp + 60
        );
        const biBal = (await BTCB.balanceOf(wbnbRecipient2.address)).sub(pancakeBal);
        console.log("bi", biBal);

        // await USDC.connect(usdSource).approve(mdex.address, amountInUSDC);
        // await mdex.connect(usdSource).swapExactTokensForTokens(
        //     amountInUSDC,
        //     0,
        //     pathes.usdcToWeth,
        //     wbnbRecipient2.address,
        //     timestamp + 60
        // );
        // const mdexBal = (await WETH.balanceOf(wbnbRecipient2.address)).sub(pancakeBal).sub(sushiBal).sub(biBal);
        // console.log("mdex", mdexBal);

        // await USDC.connect(usdSource).approve(ape.address, amountInUSDC);
        // await ape.connect(usdSource).swapExactTokensForTokens(
        //     amountInUSDC,
        //     0,
        //     pathes.usdcToWeth,
        //     wbnbRecipient2.address,
        //     timestamp + 60
        // );
        // const apeBal = (await WETH.balanceOf(wbnbRecipient2.address)).sub(pancakeBal).sub(sushiBal).sub(biBal).sub(mdexBal);
        // console.log("ape", apeBal);

        await USDC.connect(usdSource).approve(baby.address, amountInUSDC);
        await baby.connect(usdSource).swapExactTokensForTokens(
            amountInUSDC,
            0,
            pathes.usdcToBtcb,
            wbnbRecipient2.address,
            timestamp + 90
        );
        const babyBal = (await BTCB.balanceOf(wbnbRecipient2.address)).sub(pancakeBal).sub(biBal);
        console.log("baby", babyBal);

        // await USDC.connect(usdSource).approve(nomi.address, amountInUSDC);
        // await nomi.connect(usdSource).swapExactTokensForTokens(
        //     amountInUSDC,
        //     0,
        //     pathes.usdcToWeth,
        //     wbnbRecipient2.address,
        //     timestamp + 90
        // );
        // const nomiBal = (await WETH.balanceOf(wbnbRecipient2.address)).sub(pancakeBal).sub(sushiBal).sub(biBal).sub(mdexBal).sub(apeBal).sub(babyBal);
        // console.log("nomi", nomiBal);

        // await USDC.connect(usdSource).approve(knight.address, amountInUSDC);
        // await knight.connect(usdSource).swapExactTokensForTokens(
        //     amountInUSDC,
        //     0,
        //     pathes.usdcToWeth,
        //     wbnbRecipient2.address,
        //     timestamp + 90
        // );
        // const knightBal = (await WETH.balanceOf(wbnbRecipient2.address)).sub(pancakeBal).sub(sushiBal).sub(biBal).sub(mdexBal).sub(apeBal).sub(babyBal).sub(nomiBal);
        // console.log("knight", knightBal);

        // await USDC.connect(usdSource).approve(bakery.address, amountInUSDC);
        // await bakery.connect(usdSource).swapExactTokensForTokens(
        //     amountInUSDC,
        //     0,
        //     pathes.usdcToWeth,
        //     wbnbRecipient2.address,
        //     timestamp + 90
        // );
        // const bakeryBal = (await WETH.balanceOf(wbnbRecipient2.address)).sub(pancakeBal).sub(sushiBal).sub(biBal).sub(mdexBal).sub(apeBal).sub(babyBal).sub(nomiBal);
        // console.log("bakery", bakeryBal);
    });
});