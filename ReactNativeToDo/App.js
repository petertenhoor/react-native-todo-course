import React from "react";
import {StyleSheet, Text, View, Alert, ListView, Keyboard, AsyncStorage, ActivityIndicator} from "react-native";
import clone from "clone";

import Header from "./components/header";
import Footer from "./components/footer";
import RowItem from "./components/rowItem";

import autoBind from "./utils/autoBind";
import filterTypes from "./utils/filterTypes";
import filterItems from "./utils/filterItems";

@autoBind
class App extends React.PureComponent {

    /**
     * Define key for async storage variable
     * @type {string}
     */
    ASYNC_STORAGE_KEY = 'todo_list_items'

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
            loading: true,
            inputValue: "",
            todoItems: [],
            allComplete: false,
            dataSource: dataSource.cloneWithRows([]),
            activeFilter: filterTypes.ALL
        }
    }

    /**
     * componentWillMount lifecycle
     */
    componentWillMount() {
        AsyncStorage.getItem(this.ASYNC_STORAGE_KEY).then((json) => {
            try {
                const items = JSON.parse(json)
                this.setSource(items, items, {loading: false})
            } catch (error) {
                console.log('Parsing JSON data failed in App.ComponentWillMount', error)
                this.setState({loading: false})
            }
        })
    }

    /**
     * Handle submit of input value
     */
    handleAddItem() {
        const {inputValue, todoItems, activeFilter} = this.state
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
            this.setSource(newItems, filterItems(activeFilter, newItems), {inputValue: ""})
        }
    }

    /**
     * Remove to do list item
     * @param key {string}
     */
    handleRemoveItem(key) {
        //TODO add prompt to ask if user is sure
        const {todoItems, activeFilter} = this.state
        const newItems = clone(todoItems).filter((item) => item.key !== key)
        this.setSource(newItems, filterItems(activeFilter, newItems))
    }

    /**
     * Handle change of to do list item completion status
     * @param key {string}
     * @param complete {boolean}
     */
    handleItemCompleteChange(key, complete) {
        const {todoItems, activeFilter} = this.state
        const newItems = clone(todoItems).map((item) => {
            if (item.key !== key) return item
            return {...item, complete: complete}
        })
        this.setSource(newItems, filterItems(activeFilter, newItems))
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
        const {allComplete, todoItems, activeFilter} = this.state
        const complete = !allComplete
        const newItems = clone(todoItems).map((item) => ({...item, complete}))
        this.setSource(newItems, filterItems(activeFilter, newItems), {allComplete: complete})
    }

    /**
     * Dismiss keyboard on list view scroll (UX optimisation)
     */
    handleListViewScroll() {
        Keyboard.dismiss()
    }

    /**
     * Handle change in selected filter in footer
     * @param filter
     */
    handleFilter(filter) {
        const {todoItems} = this.state
        this.setSource(todoItems, filterItems(filter, todoItems), {activeFilter: filter})
    }

    /**
     * Handle change in text value of to do item
     * @param key
     * @param text
     */
    handleUpdateItemText(key, text) {
        const {todoItems, activeFilter} = this.state
        const newItems = clone(todoItems).map((item) => {
            if (item.key !== key) return item
            return {
                ...item,
                text
            }
        })

        this.setSource(newItems, filterItems(activeFilter, newItems))
    }

    /**
     * Handle activation / deactivation of edit mode for to do list item
     * @param key
     * @param editing
     */
    handleToggleEditing(key, editing) {
        const {todoItems, activeFilter} = this.state
        const newItems = clone(todoItems).map((item) => {
            if (item.key !== key) return item
            return {
                ...item,
                editing
            }
        })

        this.setSource(newItems, filterItems(activeFilter, newItems))
    }

    /**
     * Update list view source
     * @param items {array}
     * @param itemsDatasource {array}
     * @param otherState {object}
     */
    setSource(items, itemsDatasource, otherState = {}) {
        this.setState({
            todoItems: items,
            dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
            ...otherState
        })

        //update async storage value
        AsyncStorage.setItem(this.ASYNC_STORAGE_KEY, JSON.stringify(items))
    }

    /**
     * Get an object of filter counts
     * @returns {{all: *, active: *, completed: *}}
     */
    getFilterCounts() {
        const {todoItems} = this.state
        return {
            all: todoItems.length,
            active: clone(todoItems).filter((item) => !item.complete).length,
            completed: clone(todoItems).filter((item) => item.complete).length
        }
    }

    /**
     * Render lifecycle
     * @returns {*}
     */
    render() {
        const {inputValue, todoItems, dataSource, activeFilter, loading} = this.state
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
                                      return (
                                          <RowItem key={key}
                                                   {...value}
                                                   onItemRemove={() => this.handleRemoveItem(key)}
                                                   onItemComplete={(complete) => {
                                                       this.handleItemCompleteChange(key, complete)
                                                   }}
                                                   onUpdate={(text) => this.handleUpdateItemText(key, text)}
                                                   onToggleEdit={(editing) => {
                                                       this.handleToggleEditing(key, editing)
                                                   }}/>
                                      )
                                  }}
                                  renderSeparator={(sectionId, rowId) => {
                                      return <View key={rowId} style={styles.itemSeperator}/>
                                  }}/>
                    ) : (
                        <Text style={styles.noItemText}>
                            There are currently no items on your to do list. Go add some using the input above!
                        </Text>)}
                </View>

                <Footer onFilter={this.handleFilter}
                        activeFilter={activeFilter}
                        filterCounts={this.getFilterCounts()}/>

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator animating={true} size="large"/>
                    </View>
                ) : null}

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
    },
    loaderContainer: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.2)"
    }
})

/**
 * Export component
 */
export default App;