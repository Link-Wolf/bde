import React from "react";
import ProductList from "./ProductList";

/**
 * @brief a div that contains the product list 
 * was supposed to be a bigger component but as of now it's just a div)
 */
const Shop = () => {
    return (
        <div className={`${"flex"}`}>
            <div>
                <ProductList />
            </div>
        </div>
    );
};

export default Shop;
