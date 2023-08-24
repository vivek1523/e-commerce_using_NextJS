import { Product } from '../../components';
import { urlFor, client } from '../../lib/client';
import React ,{ useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useStateContext } from '../../context/StateContext';


const ProductDetails = ({ product, products }) => {
    const { image, name, details, price } = product;

    const [index, setIndex] = useState(0);

    const { decQty, incQty ,qty, onAdd, setShowCart} = useStateContext();

    const handleBuyNow = ()=>{
        onAdd(product, qty);

        setShowCart(true);
    }

      return (
    <div>
        <div className='product-detail-container'>
            <div>
                <div className='image-container'>
                   <img src={urlFor(image && image[index])} className='product-detail-image'/>
                </div>
                <div className='small-images-container'>
                 {image?.map((item, i) =>(
                       <img key={i} src={urlFor(item)} className={i === index ? 'small-image selected-image' : 'small-image'} onMouseEnter={() =>setIndex(i)}/>
                 ))}
                </div>
                </div>

                <div className='product-detail-desc'><h1>{name}</h1>
                  <div className="reviews">
                    <div>
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiOutlineStar />
                    </div>
                    <p>(4.5 out of 6 reviews)</p>
                  </div>
                  <div>
                    <h2>Details:</h2>
                    <p>{details}</p>
                    <p className='price'>${price}</p>
                    <div className='quantity'>
                       <h2>Quantity:</h2>
                       <p className='quantity-desc'>
                        <span className='minus' onClick={decQty}><AiOutlineMinus/></span>
                        <span className='num' onClick="">{qty}</span>
                        <span className='plus' onClick={incQty}><AiOutlinePlus/></span>
                       </p>
                    </div>
                    <div className="buttons">
                      <button type='button' className='add-to-cart' onClick={()=>onAdd(product, qty)}>Add to Cart</button>
                      <button type='button' className='buy-now' onClick={handleBuyNow}>Buy Now</button>
                    </div>
                </div>
            </div>
          </div>
          <div className='maylike-product-wrapper'>
               <h2>You may also like</h2>
               <div className='marquee'>
                <div className='maylike-products-container track'>
                    {products.map((item) =>(
                        <Product key={item._id} product={item}/>
                    ))}
                </div>
                </div>
                </div>
        </div>
  )
}

export const getStaticPaths = async ()=>{
    const query = `*[_type == "product"] {
        slug {
            current
        }
    }`;

    const products = await client.fetch(query);

    const paths = products.map((product) => {
        // Check if the product and its properties are defined and not null
        if (product && product.slug && product.slug.current) {
            return {
                params: {
                    slug: product.slug.current
                }
            };
        }
        return null; // Handle the case where product or its properties are undefined or null
    }).filter(Boolean); // Remove any null values from the array
    
 

    // const paths = products.map((product) => ({

    //     params: {
    //         slug: product.slug.current
    //     }
    // }));

    return {
        paths,
        fallback: 'blocking'
    }
}


export const getStaticProps = async ({params: { slug }}) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const produtsQuery ='*[_type == "product"]';
    const product = await client.fetch(query);
    const products =await client.fetch(produtsQuery);

    return{
      props: { products, product }
    }
  }


export default ProductDetails