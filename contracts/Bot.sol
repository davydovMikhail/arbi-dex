// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IRouter.sol";
// import "./interfaces/IERC20.sol";

contract Bot {
    using SafeERC20 for IERC20;

    address[] private routers;
    address[] private stables;
    address private WETH;

    constructor() {

    }


    function swap(address tokenFrom, address tokenPair, uint256 swapAmount) external {
        (uint256 amountOutWETH, address firstRouter) = _getBestRouter(swapAmount, tokenFrom, tokenPair);
        address[] memory path = new address[](2);
        path[0] = tokenFrom;
        path[1] = tokenPair;
        IERC20(tokenFrom).safeApprove(firstRouter, swapAmount);
        IRouter(firstRouter).swapExactTokensForTokens(swapAmount, amountOutWETH, path, address(this), block.timestamp);



    }






    function _getBestRouter(uint amountIn, address tokenIn, address tokenOut) private view returns(uint amountOut, address router) {
        address[] memory _path = new address[](2);
        _path[0] = tokenIn;
        _path[1] = tokenOut;
        for(uint i = 0; i < routers.length; i++) {
            uint outPrice = (IRouter(routers[i]).getAmountsOut(amountIn, _path))[1];
            if(outPrice > amountOut) {
                amountOut = outPrice;
                router = routers[i];
            } 
        }
    }

    function getRouters() external view returns(address[] memory) {
        return routers;
    }

    function getStables() external view returns(address[] memory) {
        return stables;
    }
}