import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  SafeAreaView,
} from "react-native";
import Task from "./components/Task";
import AddTask from "./components/AddTask";
import DeleteTask from "./components/DeleteTask";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function App() {
  // const server = require("./server");

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleAddTask = async (task) => {
    try {
      const response = await axios.post("http://localhost:5000/api/tasks", {
        title: task,
      });
      setItems((prevItems) => [...prevItems, response.data]);
      console.log("Task added to server: " + response.data);
    } catch (error) {
      console.error("Error adding task to server: ", error);
    }

    //const updatedTasks = [...items, { text: task, isCompleted: false }];
    //setItems(updatedTasks);
    //saveTasks(updatedTasks);
  };

  const handleTaskUpdate = async (index) => {
    const updatedTasks = [...items];
    updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
    setItems(updatedTasks);
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${updatedTasks[index]._id}`,
        { isCompleted: updatedTasks[index].isCompleted }
      );
    } catch (error) {
      console.error("Error updating task on server: ", error);
    }
  };

  const handleTaskDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting task from server: ", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const [items, setItems] = useState([]);
  /*const handleAddTask = (task) => {
    const updatedTasks = [...items, { text: task, isCompleted: false }];
    setItems(updatedTasks);
    saveTasks(updatedTasks);
  };*/

  const saveTasks = async (tasks) => {
    try {
      const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem("my-key", jsonValue);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  /*useEffect(() => {
    const loadTasks = async () => {
      try {
        const value = await AsyncStorage.getItem("my-key");
        // console.log("Stored tasks: ", value);
        if (value !== null) {
          setItems(JSON.parse(value));
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    loadTasks();
  }, []);*/

  const [deleteMode, setDeleteMode] = useState(false);

  const handleDeleteTask = (index) => {
    setDeleteMode(true);
  };

  const handleTaskPressed = async (index) => {
    let updatedTasks = [...items];

    if (deleteMode) {
      updatedTasks.splice(index, 1);
      setItems(updatedTasks);
      setDeleteMode(false);
    } else {
      updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
      if (updatedTasks[index].isCompleted) {
        const completedTask = updatedTasks.splice(index, 1);
        updatedTasks = [...updatedTasks, completedTask[0]];
      }
      setItems(updatedTasks);
    }

    try {
      const jsonValue = JSON.stringify(updatedTasks);
      await AsyncStorage.setItem("my-key", jsonValue);
    } catch (error) {
      console.error("Error saving tasks to AsyncStorage: ", error);
    }
  };

  const onTaskPress = async (text) => {
    const updatedTasks = [...items, { text: text, isCompleted: false }];
    setItems(updatedTasks);

    try {
      const jsonValue = JSON.stringify(updatedTasks);
      await AsyncStorage.setItem("my-key", jsonValue);
    } catch (error) {
      console.error("Error saving tasks to AsyncStorage: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>

        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Task
              text={item.text}
              isCompleted={item.isCompleted}
              onPress={() => handleTaskPressed(index)}
            />
          )}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <AddTask onPress={handleAddTask} style={styles.addTaskContainer} />
          <DeleteTask
            onPress={handleDeleteTask}
            style={styles.deleteTaskContainer}
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F1F1",
  },
  tasksWrapper: {
    flex: 1,
    marginTop: 80,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: "bold",
  },
  items: {
    marginTop: 32,
  },
  item: {
    marginBottom: 16,
  },
  addTaskContainer: {
    flex: 7,
    position: "relative",
    //bottom: 30,
    width: "100%",
    justifyContent: "space-between",
  },
  deleteTaskContainer: {
    flex: 1,
    position: "relative",
    width: "100%",
  },
});

/*<View style={styles.items}>
{items.map((item, index) => (
  <Task
    text={item.text}
    key={index}
    onPress={() => handleTaskPressed(index)}
    isCompleted={item.isCompleted}
  ></Task>
))}
</View>*/
