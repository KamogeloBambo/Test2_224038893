import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, Button, StyleSheet, TouchableOpacity } from "react-native";
import { db, auth } from "../firebaseConfig";
import { ref, onValue, set } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  const saveToLocal = async (items) => {
    try {
      await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  };

  const loadFromLocal = async () => {
    try {
      const stored = await AsyncStorage.getItem(`cart_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading from local storage:', error);
      return [];
    }
  };



  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const cartRef = ref(db, `carts/${userId}`);
    const unsubscribe = onValue(cartRef, 
      (snapshot) => {
        const items = snapshot.exists() ? snapshot.val() || [] : [];
        setCartItems(items);
        saveToLocal(items);
        setLoading(false);
      },
      async (error) => {
        console.error('Error fetching cart:', error);
        const localItems = await loadFromLocal();
        setCartItems(localItems);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  const updateCart = async (updatedItems) => {
    try {
      const cartRef = ref(db, `carts/${userId}`);
      await set(cartRef, updatedItems);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const increment = (id) => {
    const updated = cartItems.map((i) =>
      i.id === id ? { ...i, quantity: i.quantity + 1 } : i
    );
    updateCart(updated);
  };

  const decrement = (id) => {
    const updated = cartItems
      .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0);
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((i) => i.id !== id);
    updateCart(updated);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const addTestData = () => {
    const dummyItems = [
      { id: 1, title: "T-Shirt", price: 299, image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg", quantity: 2 },
      { id: 2, title: "Jeans", price: 599, image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg", quantity: 1 },
      { id: 3, title: "Sneakers", price: 899, image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg", quantity: 1 }
    ];
    updateCart(dummyItems);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Your cart is empty</Text>
        <Button title="Add Test Data" onPress={addTestData} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
              <Text>{item.title}</Text>
              <Text>R{item.price}</Text>
              <Text>Qty: {item.quantity}</Text>
              <Text>Subtotal: R{(item.price * item.quantity)}</Text>
              <View style={styles.buttons}>
                <Button title="+" onPress={() => increment(item.id)} />
                <Button title="-" onPress={() => decrement(item.id)} />
                <Button title="Remove" onPress={() => removeItem(item.id)} />
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.total}>
        <Text style={styles.totalText}>Total: R{calculateTotal()}</Text>
        <Button title="Clear Cart" onPress={clearCart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { flexDirection: 'row', marginBottom: 10, padding: 10, borderWidth: 1 },
  image: { width: 60, height: 60 },
  details: { marginLeft: 10, flex: 1 },
  buttons: { flexDirection: 'row', marginTop: 5 },
  total: { padding: 15, borderTopWidth: 1, alignItems: 'center' },
  totalText: { fontSize: 18, fontWeight: 'bold' },
});
