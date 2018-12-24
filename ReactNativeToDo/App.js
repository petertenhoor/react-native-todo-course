import React from "react";
import {StyleSheet, Text, View, Alert, ListView, Keyboard} from "react-native";
import clone from "clone";

import Header from "./components/header";
import Footer from "./components/footer";
import RowItem from "./components/rowItem";

import autoBind from "./utils/autoBind";

@autoBind
class App extends React.PureComponent {
    /**
     * App Constructor
     * @param props
     */
    constructor(props) {
        super(props)

        //create data source object
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

        //define state
        this.state = {
            inputValue: "",
            todoItems: [],
            allComplete: false,
            dataSource: dataSource.cloneWithRows([])
        }
    }

    /**
     * Handle submit of input value
     */
    handleAddItem() {
        const {inputValue, todoItems} = this.state
        if (inputValue === '') {
            Alert.alert(
                'Your task has no name!',
                'Enter a name for your task using the textfield on the topside of this view :)',
                [{text: 'OK'}],
                {cancelable: true}
            )
        } else {
            //TODO check if exact same value is already in items
            //TODO check if all items are complete and if so, update state
            const newItems = clone(todoItems)
            newItems.push({key: Date.now(), text: inputValue, complete: false})
            this.setSource(newItems, newItems, {inputValue: ""})
        }
    }

    /**
     * Handle change of input value in Header component
     * @param value {string}
     */
    handleInputChange(value) {
        this.setState({inputValue: value})
    }

    /**
     * Toggle all list items to complete or not complete
     */
    handleToggleAllComplete() {
        //TODO add prompt to ask if user is sure
        const {allComplete, todoItems} = this.state
        const complete = !allComplete
        const newItems = clone(todoItems).map((item) => ({...item, complete}))
        this.setSource(newItems, newItems, {allComplete: complete})
    }

    /**
     * Dismiss keyboard on list view scroll (UX optimisation)
     */
    handleListViewScroll() {
        Keyboard.dismiss()
    }

    /**
     * Update list view source
     * @param items
     * @param itemsDatasource
     * @param otherState
     */
    setSource(items, itemsDatasource, otherState = {}) {
        this.setState({
            todoItems: items,
            dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
            ...otherState
        })
    }

    /**
     * Render lifecycle
     * @returns {*}
     */
    render() {
        const {inputValue, todoItems, dataSource} = this.state
        return (
            <View style={styles.appContainer}>

                <Header inputValue={inputValue}
                        onAddItem={this.handleAddItem}
                        onInputChange={this.handleInputChange}
                        onToggleAllComplete={this.handleToggleAllComplete}/>

                <View style={styles.appContent}>
                    {todoItems.length > 0 ? (
                        <ListView style={styles.itemList}
                                  enableEmptySections={true}
                                  dataSource={dataSource}
                                  onScroll={this.handleListViewScroll}
                                  renderRow={({key, ...value}) => {
                                      return (<RowItem key={key} {...value}/>)
                                  }}
                                  renderSeparator={(sectionId, rowId) => {
                                      return <View key={rowId} style={styles.itemSeperator}/>
                                  }}/>
                    ) : (
                        <Text style={styles.noItemText}>
                            There are currently no items on your to do list. Go add some using the input above!
                        </Text>)}
                </View>

                <Footer/>

            </View>
        )
    }
}

/**
 * Define styles
 */
const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        marginTop: 24
    },
    appContent: {
        flex: 1
    },
    noItemText: {
        padding: 16
    },
    itemList: {
        backgroundColor: "#FFF"
    },
    itemSeperator: {
        borderWidth: 1,
        borderColor: "#f5f5f5"
    }
})

/**
 * Export component
 */
export default App;