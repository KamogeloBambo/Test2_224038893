import React, { useState, useEffect } from "react";
import { View, FlatList, Text, Image, TouchableOpacity, ActivityIndicator, Button } from "react-native";

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ flexDirection: "row", marginBottom: 10, borderWidth: 1, padding: 5 }}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
          >
            <Image source={{ uri: item.image }} style={{ width: 60, height: 60 }} />
            <View style={{ marginLeft: 10, justifyContent: "center" }}>
              <Text numberOfLines={1}>{item.title}</Text>
              <Text>R{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
