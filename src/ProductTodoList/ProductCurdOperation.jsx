
import { useEffect, useState } from "react";
import '../Curd.css';

const ProductCurdOperation = () => {

  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
   const [showModal, setShowModal] = useState(false);
   const [searchById,setSearchById]=useState("");

   const [sortedingByPrice,setSortByPrice]=useState('asc');

   const AddModal=()=>{
    setEditId(null);
    setTitle("");
    setPrice("");
    setShowModal(true); 
   }

   const EditModal=(product)=>{
    setEditId(product.id);
    setTitle(product.title);
    setPrice(product.price);
    setShowModal(true);
   }

   const closeModal=()=>{
    setShowModal(false);
  
   }

   const sortByPrice = () => {
  let nextOrder;

  if (sortedingByPrice === "asc") {
    nextOrder = "desc";
  } else {
    nextOrder = "asc";
  }

  const sorted = [...products].sort((a, b) => {
    if (nextOrder === "asc") {
      return Number(a.price) - Number(b.price);
    } else {
      return Number(b.price) - Number(a.price);
    }
  });

  setProducts(sorted);
  setSortByPrice(nextOrder);
};


   


  // READ (GET)
  useEffect(() => {
    const  fetchProducts = async () => {
        try{
        const response=await fetch("https://dummyjson.com/products");
        const data =await response.json();
        setProducts(data.products);
        }catch(error){
            console.error("Error fetching in products:", error);
        }
    };
     fetchProducts();
  }, []);

 
   const searchIdResponse= async ()=>{
    if(!searchById){
        alert('Enter ID')
      return
    }
    try{
        const searchId=await fetch(`https://dummyjson.com/products/${searchById}`);
        if(!searchId.ok){
            throw new Error("Invalid ID");
            
        }
        const data=await searchId.json();
         setProducts([data]);
    }catch{
        console.error("Failed")
    }
   

};


  // ADD PRODUCT
  const addProduct = async () => {
    try {
      if (!title || !price) {
        alert("Please fill in all fields");
        return;
      }

      const url = await "https://dummyjson.com/products/add";
      const newProduct = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price
        })
      };

      const submitResponse = await fetch(url, newProduct);
      const data = await submitResponse.json();

      setProducts([...products,data]);
      closeModal();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

 

  //updateProduct
  const updateProduct = async () => {

    const url=` https://dummyjson.com/products/${editId}`;
    const updatedProduct={
        method:"PUT",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
            title,
            price
      
        })
    };
    const res=await fetch(url,updatedProduct);
    if(!res.ok){
        throw new Error("Failed to update product");

    }
    const data=await res.json();
    setProducts(products.map(p=>
        p.id===editId ? data : p
    ));
    closeModal();

   
  };

  // DELETE PRODUCT
 const deleteProduct = async (id) => {

  const url = `https://dummyjson.com/products/${id}`;
  const deleteProduct = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  };

  const response = await fetch(url, deleteProduct);

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

 
  setProducts(products.filter(p => p.id !== id));
};



return(
    <div className="container">
        <h2>PRODUCT LIST</h2>
          {/* <div className="form">
            <label className="required">Title</label>
            <input type='text' placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/>
            <label className="required">Price</label>
            <input type="number" placeholder='Price' value={price} onChange={e=>setPrice(e.target.value)}/>
          
          {editId?(<button className="btn update" onClick={updateProduct}>Update product</button>):
          (<button className="btn add" onClick={addProduct}>Add product</button>)
          }
          </div> */}
          <button className="btn add" onClick={AddModal}>Add</button>
          <button className="btn" onClick={sortByPrice}>Sort By Price</button>
          <label>SearchById</label>
          <input type="number" placeholder="SearchById" value={searchById} onChange={e=>setSearchById(e.target.value)}/>
          <button className="btn" onClick={searchIdResponse}>Search</button>
          <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product=>(
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.title}</td>
                        <td>{product.price}</td>
                        <td>
                            <button className="btn edit" onClick={()=>EditModal(product)}>Edit</button>
                            <button className="btn delete" onClick={()=>deleteProduct(product.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
          {showModal &&(
            <div className="container">
          <div className="modal-overlay">
           < div className="modal">
           <h2>{editId? "Edit Product" : "Add Product"}</h2>
           <label>Title</label>
           <input type='text' placeholder='Title' value={title} onChange={e=>setTitle(e.target.value)}/>

           <label>Price</label>
           <input type='number' placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)}/>

         <div className="modal-action">

            {editId?(<button className="btn update" onClick={updateProduct}>Update</button>):
            
            (<button className="btn add" onClick={addProduct}>Add</button>)
            
            }

            <button className="btn close" onClick={closeModal}>Close</button>

            

         </div>

            </div> 
             </div>
             </div>
          
          
          )}
          
    </div>
    
    

  
);
};

export default ProductCurdOperation;
