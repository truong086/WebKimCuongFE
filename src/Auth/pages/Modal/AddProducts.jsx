import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import "./AddModal.scss";
import { createProduct, editProduct } from '../../Services/ProductService';
import { getAllCategories } from '../../Services/CategoryService';

Modal.setAppElement('#root');

const AddProductModal = ({ isOpen, onRequestClose, onProductAdded, productToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState(0);
    const [click, setClick] = useState(0);
    const [categories, setCategories] = useState([]);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        if (productToEdit) {
            setTitle(productToEdit.title);
            setDescription(productToEdit.description);
            setImage(productToEdit.image[0]);
            setCategoryId(productToEdit.category[0]);
            setPrice(productToEdit.price);
            setClick(productToEdit.click);
        } else {
            setTitle('');
            setDescription('');
            setImage('');
            setCategoryId('');
            setPrice(0);
            setClick(0);
        }
        return () => {
            setIsMounted(false);
        };
    }, [productToEdit]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories(1, 200);
                if (response && response.errorCode === 200) {
                    setCategories(response.content.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const validateFields = () => {
        if (!title) {
            alert('Title is required.');
            return false;
        }
        if (!description) {
            alert('Description is required.');
            return false;
        }
        if (!categoryId) {
            alert('Category is required.');
            return false;
        }
        if (price <= 0) {
            alert('Price must be greater than zero.');
            return false;
        }
        return true;
    };

    const handleAddProduct = async () => {
        if (!validateFields()) {
            return;
        }

        try {
            if (productToEdit) {
                const productData = {
                    id: productToEdit.id,
                    title: title,
                    description: description,
                    category: [categoryId],
                    price: price,
                    click: click,
                    account_id: 0,
                    account_name: "admin",
                    imageShop: "",
                    nameShop: ""
                };
                if (image) {
                    productData.image = [image];
                } else {
                    productData.image = [productToEdit.image];
                }

                await editProduct(productData);
            } else {
                await createProduct({
                    id: 0,
                    title: title,
                    description: description,
                    image: [image],
                    category: [categoryId],
                    price: price,
                    click: click,
                    account_id: 0,
                    account_name: "",
                    imageShop: "",
                    nameShop: ""
                });
            }
            if (isMounted) {
                onRequestClose();
                onProductAdded();
            }
        } catch (error) {
            if (isMounted) {
                console.error('Error saving product:', error);
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isMounted) {
                    setImage(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={productToEdit ? "Edit Product" : "Add Product"}
        >
            <h2>{productToEdit ? "Edit Product" : "Add New Product"}</h2>
            <form>
                <div className='form-group'>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Description:</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Image:</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {productToEdit && image && (
                        <div>
                            <p>Current Image:</p>
                            <img src={image} alt="Current" style={{ height: 100 }} />
                        </div>
                    )}
                </div>
                <div className='form-group'>
                    <label>Category:</label>
                    <select
                        style={{
                            padding: '10px',
                            fontSize: '16px',
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            width: '100%',
                            boxSizing: 'border-box',
                            backgroundColor: '#fff',
                            backgroundImage: 'linear-gradient(to top, #f9f9f9, #fff)',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">Select category...</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className='form-group'>
                    <label>Price:</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Click:</label>
                    <input type="number" value={click} onChange={(e) => setClick(e.target.value)} />
                </div>
                <div className="modal-buttons">
                    <button type="button" onClick={handleAddProduct} className="add-button">
                        {productToEdit ? "Save Changes" : "Add Product"}
                    </button>
                </div>
            </form>
            <button onClick={onRequestClose}>Close</button>
        </Modal>
    );
};

export default AddProductModal;
