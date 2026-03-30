# 11-FlatList

```tsx
// React Native FlatList 组件的使用

import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  styleSheet,
} from "react-native";
import { axios } from "axios";

const data = [
  { id: "1", title: "React Native" },
  { id: "2", title: "TypeScript" },
  { id: "3", title: "GraphQL" },
  { id: "4", title: "Node.js" },
  { id: "5", title: "MongoDB" },
  { id: "6", title: "Express.js" },
  { id: "7", title: "Redux" },
  { id: "8", title: "React Navigation" },
  { id: "9", title: "Jest" },
  { id: "10", title: "Enzyme" },
];

const FlatListScreen = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchData = async ({ page = 1, limit = 10 }) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos",
        {
          params: {
            _page: page,
            _limit: limit,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      if (total > 0 && data.length >= total) {
        setLoading(false);
        return;
      }
      setData([...data, ...response.data]);
      setTotal(response.headers["x-total-count"]);
      setPage(page + 1);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=${limit}`
      );
      console.log(response.data);
      setData([...data, ...response.data]);
      setPage(page + 1);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({ page: 1, limit: 10 });
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item.id)}
        style={styleSheet.container}
      >
        <Text>{item.title}</Text>
      </TouchableOpacity>
    );
  };
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} // 用于指定唯一的key
        style={{ backgroundColor: "white" }}
        onEndReachedThreshold={0.5} // 距离底部还有多少距离时触发onEndReached
        onEndReached={loadMore} // 到达底部时触发
        ListFooterComponent={
          loading && <ActivityIndicator size="small" color="#0000ff" /> // 底部组件
        }
      />
      <Text>Selected ID: {selectedId}</Text>
    </View>
  );
};

styleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
  },
});

export default FlatListScreen;
```
