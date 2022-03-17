import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Switch,StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TasksList = () => {

    const [task, setTask] = useState();
    const [taskList, setTaskList] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    useEffect(() => {
        async function fetchMyAPI() {
            try {
                const value = await AsyncStorage.getItem('@storage_Key')
                if(value !== null) {
                    console.log(taskList);
                    setTaskList(JSON.parse(value));
                  // value previously stored
                }
              } catch(e) {
                  console.log(e);
                // error reading value
              }
    }
    fetchMyAPI()
    }, [])

    const storeData = async () => {
        try {
          await AsyncStorage.setItem('@storage_Key', JSON.stringify(taskList))
        } catch (e) {
            console.log(e);
          // saving error
        }
      }

    const addTask = () => {
        if (task != undefined) {
            setTaskList([...taskList, { key: taskList.length + 1, value: task, status: 0 }]);
            if (isEnabled) {
                setIsEnabled(!isEnabled);
            }
            storeData()
            setTask(undefined);
        }
    }
    const markComplete = (index) => {
        var arr = [...taskList];
        var ele = arr.findIndex(e => e['key'] === index);
        arr[ele]['status'] = 1;
        setTaskList(arr);
        storeData()

    }
    const hasPending = () => {
        if (taskList.length > 0) {
            var count = taskList.filter(task => (isEnabled) ? task.status === 1 : task.status === 0);
            return (
                (count.length > 0) ?
                   <Text></Text>
                    : <Text style={styles.centeredText}>
                        {(isEnabled) ? 'No Completed tasks' : 'No Pending Tasks'}
                    </Text>
            )
        }
    }

    return (<View style={styles.container} >
        <View style={styles.title}>
            {/* <Text style={styles.titleText}>List</Text> */}
            <View style={styles.toggle}>
                <Text style={(isEnabled) ? styles.togglePnd : styles.toggleComp}>Pending</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
                <Text style={(isEnabled) ? styles.toggleComp : styles.togglePnd}>Completed</Text>
            </View>
        </View>

        {(taskList.length > 0) ?
            taskList.filter(task => (isEnabled) ? task.status === 1 : task.status === 0).map((filtered, index) => {
                return (
                    <View style={styles.item} key={index}>
                        <View style={styles.itemLeft}>
                            <View style={styles.square}></View>
                            <Text style={(!isEnabled) ? styles.itemTextPnd : styles.itemTextComp}>{filtered.value}</Text>
                        </View>
                        <TouchableOpacity onPress={() => markComplete(filtered.key)}>
                            <View style={styles.circular} >
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            }) : <Text style={styles.centeredText}>No tasks in the list</Text>
        }
        {hasPending()
        }



        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.writeTaskWrapper}
        >
            <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={(text) => setTask(text)} />

            <View >
                <Button style={styles.addButton} onPress={addTask} title='+' />
            </View>
        </KeyboardAvoidingView>
    </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f7f7',
    },
    toggle: {
        flexDirection: 'row',
        flex: 1,
    },
    toggleComp: {
        paddingLeft: 10,

    },
    togglePnd: {
        paddingLeft: 10,
        opacity: 0.4
    },
    title: {
        paddingTop: 20,
        marginHorizontal: 20,
        flexDirection: 'row',
    },
    titleText: {
        fontSize: 24,
        fontFamily: 'Roboto',
        fontWeight: 'bold'
    },
    item: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: '#55BCF6',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15,
    },
    centeredText: {
        textAlign: 'center',
        marginVertical: '50%',
        fontSize: 24,
        color: 'red',
        // fontStyle: 'italic'
        fontFamily: 'monospace'
    },
    itemTextPnd: {
        maxWidth: '80%',
        fontSize: 20,
        color: 'black',
    },
    itemTextComp: {
        maxWidth: '80%',
        fontSize: 20,
        color: 'green',
    },
    circular: {
        width: 16,
        height: 16,
        borderColor: '#55BCF6',
        borderWidth: 2,
        borderRadius: 5,
        marginRight: 10
    },
    writeTaskWrapper: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderRadius: 60,
        borderColor: '#C0C0C0',
        borderWidth: 1,
        width: 250,
    },
    addWrapper: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#C0C0C0',
        borderWidth: 1,
    },
    addButton: {
        borderRadius: 30,
        backgroundColor: 'red'
    }
})
export default TasksList