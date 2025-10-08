import React, { useState } from "react";
import { View, Text, Image, Button, Alert } from "react-native";
import { db, auth } from "../firebaseConfig";
import { ref, get, set } from "firebase/database";

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;
  const userId = auth.currentUser.uid;

  const handleAddToCart = async () => {
    if (!userId) return;

    const cartRef = ref(db, `carts/${userId}`);
    try {
      const cartSnap = await get(cartRef);

      if (cartSnap.exists()) {
        const cartData = cartSnap.val();
        const existingItem = cartData.find((i) => i.id === product.id);

        let updatedItems;
        if (existingItem) {
          updatedItems = cartData.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          updatedItems = [...cartData, { ...product, quantity: 1 }];
        }

        await set(cartRef, updatedItems);
      } else {
        await set(cartRef, [{ ...product, quantity: 1 }]);
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

