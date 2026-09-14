import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './CheckoutForm.module.css';

export default function CheckoutForm({ cartItems = [], totalAmount = 0, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        paymentMethod: 'card', // 'card' or 'cash'
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Custom Formatter: Card Number (Adds spaces every 4 digits)
        if (name === 'cardNumber') {
            const rawValue = value.replace(/\D/g, '').slice(0, 16);
            const formattedValue = rawValue.replace(/(\d{4})(?=\d)/g, '$1 ');
            setFormData((prev) => ({ ...prev, cardNumber: formattedValue }));
            return;
        }

        // Custom Formatter: Expiry Date (Adds '/' after month)
        if (name === 'expiryDate') {
            const rawValue = value.replace(/\D/g, '').slice(0, 4);
            let formattedValue = rawValue;
            if (rawValue.length >= 3) {
                formattedValue = `${rawValue.slice(0, 2)}/${rawValue.slice(2)}`;
            }
            setFormData((prev) => ({ ...prev, expiryDate: formattedValue }));
            return;
        }

        // Custom Formatter: Phone & CVV (Numbers only)
        if (name === 'phone') {
            const rawValue = value.replace(/\D/g, '').slice(0, 11);
            setFormData((prev) => ({ ...prev, phone: rawValue }));
            return;
        }

        if (name === 'cvv') {
            const rawValue = value.replace(/\D/g, '').slice(0, 3);
            setFormData((prev) => ({ ...prev, cvv: rawValue }));
            return;
        }

        // Handle Payment Method Switching (Reset card fields when switching to 'cash')
        if (name === 'paymentMethod') {
            setFormData((prev) => ({
                ...prev,
                paymentMethod: value,
                cardNumber: value === 'cash' ? '' : prev.cardNumber,
                expiryDate: value === 'cash' ? '' : prev.expiryDate,
                cvv: value === 'cash' ? '' : prev.cvv
            }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Order Submitted:', { formData, cartItems, totalAmount });

        Swal.fire({
            icon: 'success',
            title: 'Your request has been successfully',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#1e293b',
            color: '#ffffff',
            iconColor: '#22c55e'
        });

        if (onSuccess) {
            onSuccess();
        } else if (onClose) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.checkoutCard}>
                <button className={styles.closeBtn} onClick={onClose} type="button">✕</button>

                <h2 className={styles.title}>Order confirmation</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* SHIPPING INFO  */}
                    <div className={styles.section}>
                        <h3>Shipping and delivery info</h3>

                        <div className={styles.inputGroup}>
                            <label> Full Name </label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                placeholder="Enter Your Name"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="example@mail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Phone Numper</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    inputMode="numeric"
                                    required
                                    placeholder="01122042004"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    placeholder="Street / Building number"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    placeholder="Cairo / Giza..."
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* CHOOSE THE METHOD OF PAYMENT  */}
                    <div className={styles.section}>
                        <h3>Payment method</h3>

                        <div className={styles.paymentOptions}>
                            <label className={`${styles.radioCard} ${formData.paymentMethod === 'card' ? styles.active : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={formData.paymentMethod === 'card'}
                                    onChange={handleChange}
                                />
                                Credit card / Misa
                            </label>

                            <label className={`${styles.radioCard} ${formData.paymentMethod === 'cash' ? styles.active : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={formData.paymentMethod === 'cash'}
                                    onChange={handleChange}
                                />
                                Cash on delivery
                            </label>
                        </div>

                        {/* INFO ABOUT VISA CARD  */}
                        {formData.paymentMethod === 'card' && (
                            <div className={styles.cardDetails}>
                                <div className={styles.inputGroup}>
                                    <label>Card number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        inputMode="numeric"
                                        maxLength="19" // 16 digits + 3 spaces
                                        required={formData.paymentMethod === 'card'}
                                        placeholder="1234 5678 9101 1121"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.row}>
                                    <div className={styles.inputGroup}>
                                        <label>Expiration date</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            inputMode="numeric"
                                            maxLength="5"
                                            required={formData.paymentMethod === 'card'}
                                            placeholder="MM/YY"
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Security code (CVV)</label>
                                        <input
                                            type="password"
                                            name="cvv"
                                            inputMode="numeric"
                                            maxLength="3"
                                            required={formData.paymentMethod === 'card'}
                                            placeholder="123"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CHECKOUT AND END  */}
                    <div className={styles.footer}>
                        <div className={styles.totalPrice}>
                            <span> Total </span>
                            <strong>${totalAmount}</strong>
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            Checkout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}