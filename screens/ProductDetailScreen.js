import React, { useState } from "react";
import { View, Text, Image, Button, Alert } from "react-native";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;
  const userId = auth.currentUser.uid;

  const handleAddToCart = async () => {
    if (!userId) return;

    const cartRef = doc(db, "carts", userId);
    try {
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const existingItem = cartData.items.find((i) => i.id === product.id);

        let updatedItems;
        if (existingItem) {
          updatedItems = cartData.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          updatedItems = [...cartData.items, { ...product, quantity: 1 }];
        }

        await updateDoc(cartRef, { items: updatedItems });
      } else {
        await setDoc(cartRef, { items: [{ ...product, quantity: 1 }] });
      }

      Alert.alert("Success", "Product added to cart!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Image source={{ uri: product.image }} style={{ width: "100%", height: 200 }} />
      <Text style={{ fontWeight: "bold", fontSize: 18, marginVertical: 10 }}>{product.title}</Text>
      <Text style={{ marginBottom: 10 }}>R{product.price}</Text>
      <Text style={{ marginBottom: 20 }}>{product.description}</Text>
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
}

