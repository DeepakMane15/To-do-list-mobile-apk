import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Image, Switch, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TasksList = () => {

    const [task, setTask] = useState();
    const [taskList, setTaskList] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    const [update, setUpdate] = useState(false);
    const [editId, setEditId] = useState();
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    useEffect(() => {

        async function fetchMyAPI() {
            try {
                const value = await AsyncStorage.getItem('@storage_Key')
                if (value !== null) {
                    console.log('value', value);
                    setTaskList(JSON.parse(value));
                    // value previously stored
                }
            } catch (e) {
                console.log('error: ', e);
                // error reading value
            }

            //   try {
            //     await AsyncStorage.removeItem('@MyApp_key')
            //   } catch(e) {
            //     // remove error
            //   }
        }
        fetchMyAPI()

    }, [])

    const storeData = async (type, task) => {
        try {
            if (type === 'push') {
                await AsyncStorage.setItem('@storage_Key', JSON.stringify([...taskList, { key: taskList.length + 1, value: task, status: 0 }]))
            } else {
                await AsyncStorage.setItem('@storage_Key', JSON.stringify(taskList));
            }
        } catch (e) {
            console.log('error', e);
            // saving error
        }
    }

    const addTask = () => {
        if (task != undefined) {
            if (update) {
                var arr = [...taskList];
                console.log(editId);
                arr[editId]['value'] = task;
                setTaskList(arr);
            } else {
                setTaskList([...taskList, { key: taskList.length + 1, value: task, status: 0 }]);
            }
            if (isEnabled) {
                setIsEnabled(!isEnabled);
            }
            storeData('push', task)
            setTask(undefined);
            setUpdate(false);
            setEditId(undefined);
        }
    }
    const deleteTask = (index) => {
        var arr = [...taskList];
        var ele = arr.findIndex(e => e['key'] === index);
        arr.splice(ele,1);
        setTaskList(arr);
    }
    const changeStatus = (index) => {
        var arr = [...taskList];
        var ele = arr.findIndex(e => e['key'] === index);
        if(isEnabled){
            arr[ele]['status'] = 0;
        } else{
            arr[ele]['status'] = 1;
        }
            setTaskList(arr);
            storeData('update', undefined);
    
}
    const edit = (index) => {
        setUpdate(true);
        var arr = [...taskList];
        var ele = arr.findIndex(e => e['key'] === index);
        setEditId(ele);
        setTask(arr[ele]['value']);
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
<ScrollView>
        {(taskList.length > 0) ?
            taskList.filter(task => (isEnabled) ? task.status === 1 : task.status === 0).map((filtered, index) => {
                return (
                    <View style={styles.item} key={index}>
                        <View style={styles.itemLeft}>
                            <View style={styles.square}></View>
                            <Text style={(!isEnabled) ? styles.itemTextPnd : styles.itemTextComp}>{filtered.value}</Text>
                        </View>
                        <View style={styles.options}>
                            <TouchableOpacity onPress={() => changeStatus(filtered.key)}>
                                <Image source={(!isEnabled)?  require('../assets/check.png') :require('../assets/reload.png') } style={{ height: 20, width: 20, marginRight: 5 }} />
                            </TouchableOpacity>
                           { (!isEnabled)? <TouchableOpacity onPress={() => edit(filtered.key)}>
                                <Image source={require('../assets/draw.png')} style={{ height: 20, width: 20, marginRight: 5 }} />
                            </TouchableOpacity> : null}
                            <TouchableOpacity onPress={() => deleteTask(filtered.key)}>
                                <Image source={require('../assets/delete.png')} style={{ height: 20, width: 20, marginRight: 5 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }) : <Text style={styles.centeredText}>No tasks in the list</Text>
        }
        </ScrollView>
        {hasPending()
        }



        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.writeTaskWrapper}
        >
            <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={(text) => setTask(text)} />

            <View >
                <Button style={styles.addButton} onPress={addTask}  title={(update) ? 'Update' : 'Add'} />
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
    options: {
        flexDirection: 'row'
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
        fontSize: 16,
        color: 'black',
    },
    itemTextComp: {
        maxWidth: '80%',
        fontSize: 16,
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