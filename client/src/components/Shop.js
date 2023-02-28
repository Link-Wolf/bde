import React from "react";
import ProductList from "./ProductList";

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