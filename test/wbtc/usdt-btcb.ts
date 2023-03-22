import { expect } from "chai";
import { ethers } from "hardhat";
import keccak256 from "keccak256";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import * as mocha from "mocha-steps";
import { parseEther } from '@ethersproject/units';
import { IRouter, IToken } from '../../typechain-types';
import addresses from '../../routers.json'

describe("USDT -- BTCB", function () {

    let bnbSource: SignerWithAddress;
    let usdSource: SignerWithAddress;
    let wbnbRecipient: SignerWithAddress;
    let wbnbRecipient2: SignerWithAddress;

    async function getCurrentTime() {
        let blockNumber = await ethers.provider.getBlockNumber();
        let block = await ethers.provider.getBlock(blockNumber);
        return block.timestamp + 180;
    }

    const divider = '1000000000000000000' 

    const pathes = {
        wethToUsdt: [
            addresses.bsc.weth,
            addresses.bsc.usdt
        ],
        usdtToBtcb: [
            addresses.bsc.usdt,
            addresses.bsc.btcb
        ],
        btcbToUsdt: [
            addresses.bsc.btcb,
            addresses.bsc.usdt,
        ],
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

    let USDT: IToken;
    let WETH: IToken;
    let BTCB: IToken;

    beforeEach(async () => {
        [bnbSource, usdSource, wbnbRecipient, wbnbRecipient2] = await ethers.getSigners();
    });

    mocha.step("Tokens Initialization", async function() {
        USDT = await ethers.getContractAt("IToken", addresses.bsc.usdt);
        WETH = await ethers.getContractAt("IToken", addresses.bsc.weth);
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
    
    mocha.step("Buying USDT", async function() {
        const amountIn = parseEther("100");
        const timestamp = await getCurrentTime();
        await pancake.swapExactETHForTokens(0, pathes.wethToUsdt, usdSource.address, timestamp + 60, {value: amountIn});
        const usdtBal = await USDT.balanceOf(usdSource.address);
        console.log('usdtBal', usdtBal.div(divider));
    });

    mocha.step("Checking usdt amount for each DEX", async function() {
        const amountIn = ethers.utils.parseUnits('100', 18);
        const path = pathes.usdtToBtcb;

        const sushiAmounts = await sushi.getAmountsOut(amountIn, path);
        console.log("sushi", sushiAmounts[1]);

        const pancakeAmounts = await pancake.getAmountsOut(amountIn, path);
        console.log("pancake", pancakeAmounts[1]);

        const biAmounts = await bi.getAmountsOut(amountIn, path);
        console.log("bi", biAmounts[1]);

        const mdexAmounts = await mdex.getAmountsOut(amountIn, path);
        console.log("mdex", mdexAmounts[1]);

        const apeAmounts = await ape.getAmountsOut(amountIn, path);
        console.log("ape", apeAmounts[1]);

        const babyAmounts = await baby.getAmountsOut(amountIn, path);
        console.log("baby", babyAmounts[1]);

        const nomiAmounts = await nomi.getAmountsOut(amountIn, path);
        console.log("nomi", nomiAmounts[1]);

        // const knightAmounts = await knight.getAmountsOut(amountIn, path);
        // console.log("knight", knightAmounts[1]);

        const bakeryAmounts = await bakery.getAmountsOut(amountIn, path);
        console.log("bakery", bakeryAmounts[1]);

    });

    mocha.step("Checking weth amount for each DEX by usdt", async function() {
        const amountIn = ethers.utils.parseUnits('0.01', 18);
        const path = pathes.usdtToBtcb;

        const sushiAmounts = await sushi.getAmountsOut(amountIn, path);
        console.log("sushi", sushiAmounts[1]);

        const pancakeAmounts = await pancake.getAmountsOut(amountIn, path);
        console.log("pancake", pancakeAmounts[1]);

        const biAmounts = await bi.getAmountsOut(amountIn, path);
        console.log("bi", biAmounts[1]);

        const mdexAmounts = await mdex.getAmountsOut(amountIn, path);
        console.log("mdex", mdexAmounts[1]);

        const apeAmounts = await ape.getAmountsOut(amountIn, path);
        console.log("ape", apeAmounts[1]);

        const babyAmounts = await baby.getAmountsOut(amountIn, path);
        console.log("baby", babyAmounts[1]);

        const nomiAmounts = await nomi.getAmountsOut(amountIn, path);
        console.log("nomi", nomiAmounts[1]);

        // const knightAmounts = await knight.getAmountsOut(amountIn, path);
        // console.log("knight", knightAmounts[1]);

        const bakeryAmounts = await bakery.getAmountsOut(amountIn, path);
        console.log("bakery", bakeryAmounts[1]);

    });

    mocha.step("покупка на 100 usdt btcb в разных обмениках", async function() {
        const amountInUSDT = ethers.utils.parseUnits('100', 18);
        const timestamp = (await getCurrentTime()) + 60;


        await USDT.connect(usdSource).approve(sushi.address, amountInUSDT);
        await sushi.connect(usdSource).swapExactTokensForTokens(
            amountInUSDT,
            0,
            pathes.usdtToBtcb,
            wbnbRecipient.address,
            timestamp
        );
        const sushiBal = await BTCB.balanceOf(wbnbRecipient.address);
        console.log("sushi", sushiBal);

        await USDT.connect(usdSource).approve(pancake.address, amountInUSDT);
        await pancake.connect(usdSource).swapExactTokensForTokens(
            amountInUSDT,
            0,
            pathes.usdtToBtcb,
            wbnbRecipient.address,
            timestamp
        );
        const pancakeBal = (await BTCB.balanceOf(wbnbRecipient.address)).sub(sushiBal);
        console.log("pancake", pancakeBal);

        await USDT.connect(usdSource).approve(bi.address, amountInUSDT);
        await bi.connect(usdSource).swapExactTokensForTokens(
            amountInUSDT,
            0,
            pathes.usdtToBtcb,
            wbnbRecipient.address,
            timestamp + 60
        );
        const biBal = (await BTCB.balanceOf(wbnbRecipient.address)).sub(pancakeBal).sub(sushiBal);
        console.log("bi", biBal);

        await USDT.connect(usdSource).approve(mdex.address, amountInUSDT);
        await mdex.connect(usdSource).swapExactTokensForTokens(
            amountInUSDT,
            0,
            pathes.usdtToBtcb,
            wbnbRecipient.address,
            timestamp + 60
        );
        const mdexBal = (await BTCB.balanceOf(wbnbRecipient.address)).sub(pancakeBal).sub(sushiBal).sub(biBal);
        console.log("mdex", mdexBal);

        await USDT.connect(usdSource).approve(ape.address, amountInUSDT);
        await ape.connect(usdSource).swapExactTokensForTokens(
            amountInUSDT,
            0,
            pathes.usdtToBtcb,
            wbnbRecipient.address,
            timestamp + 60
        );
        const apeBal = (await BTCB.balanceOf(wbnbRecipient.address)).sub(pancakeBal).sub(sushiBal).sub(biBal).sub(mdexBal);
        console.log("ape", apeBal);

        await USDT.connect(usdSource).approve(baby.address, amountInUSDT);
        await baby.connect(usdSource).swapExactTokensForTokens(
            amountInUSDT,
            0,
            pathes.usdtToBtcb,
            wbnbRecipient.address,
            timestamp + 60
        );
        const babyBal = (await BTCB.balanceOf(wbnbRecipient.address)).sub(pancakeBal).sub(sushiBal).sub(biBal).sub(mdexBal).sub(apeBal);
        console.log("baby", babyBal);

        await USDT.connect(usdSource).approve(nomi.address, amountInUSDT);
        await nomi.connect(usdSource).swapExactTokensForTokens(
            amountInUSDT,
            0,
            pathes.usdtToBtcb,
            wbnbRecipient.address,
            timestamp + 60
        );
        const nomiBal = (await BTCB.balanceOf(wbnbRecipient.address)).sub(pancakeBal).sub(sushiBal).sub(biBal).sub(mdexBal).sub(apeBal).sub(babyBal);
        console.log("nomi", nomiBal);

        // await USDT.connect(usdSource).approve(knight.address, amountInUSDT);
        // await knight.connect(usdSource).swapExactTokensForTokens(
        //     amountInUSDT,
        //     0,
        //     pathes.usdtToBtcb,
        //     wbnbRecipient.address,
        //     timestamp + 60
        // );
        // const knightBal = (await BTCB.balanceOf(wbnbRecipient.address)).sub(pancakeBal).sub(sushiBal).sub(biBal).sub(mdexBal).sub(apeBal).sub(babyBal).sub(nomiBal);
        // console.log("knight", knightBal);

        await USDT.connect(usdSource).approve(bakery.address, amountInUSDT);
        await bakery.connect(usdSource).swapExactTokensForTokens(
            amountInUSDT,
            0,
            pathes.usdtToBtcb,
            wbnbRecipient.address,
            timestamp + 60
        );
        const bakeryBal = (await BTCB.balanceOf(wbnbRecipient.address)).sub(pancakeBal).sub(sushiBal).sub(biBal).sub(mdexBal).sub(apeBal).sub(babyBal).sub(nomiBal);
        console.log("bakery", bakeryBal);
    });
});