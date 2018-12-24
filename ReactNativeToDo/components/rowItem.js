import React, {PureComponent} from "react";
import {View, Text, StyleSheet, Switch, TouchableOpacity, TextInput} from "react-native";
import {string, func, bool} from "prop-types";

class RowItem extends PureComponent {
    /**
     * Render lifecycle
     * @returns {*}
     */
    render() {
        const {text, complete, onItemComplete, onItemRemove, onUpdate, onToggleEdit, editing} = this.props

        const itemTextComponent = (
            <TouchableOpacity style={styles.rowItemTextContainer}
                              onLongPress={() => onToggleEdit(true)}>
                <Text style={[styles.rowItemText, complete && styles.stateCompleted]}>
                    {text}
                </Text>
            </TouchableOpacity>
        )

        const removeButton = (
            <TouchableOpacity onPress={onItemRemove}>
                <Text style={styles.rowItemRemove}>Remove</Text>
            </TouchableOpacity>
        )

        const saveButton = (
            <TouchableOpacity onPress={() => onToggleEdit(false)}>
                <Text style={styles.rowItemSave}>Save</Text>
            </TouchableOpacity>
        )

        const editingComponent = (
            <View style={styles.rowItemTextContainer}>
                <TextInput onChangeText={onUpdate}
                           autoFocus={true}
                           value={text}
                           style={styles.editInput}
                           multiline={true}/>
            </View>
        )

        return (
            <View style={styles.rowItemContainer}>

                <Switch style={styles.rowItemSwitch}
                        value={complete}
                        onValueChange={onItemComplete}/>

                {editing ? editingComponent : itemTextComponent}

                {editing ? saveButton : removeButton}

            </View>
        )
    }
}

/**
 * Define styles
 */
const styles = StyleSheet.create({
    rowItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 50
    },
    rowItemSwitch: {
        marginHorizontal: 16
    },
    rowItemTextContainer: {
        flex: 1,
    },
    rowItemText: {
        fontSize: 16,
        color: "#222"
    },
    stateCompleted: {
        textDecorationLine: "line-through"
    },
    rowItemRemove: {
        fontSize: 16,
        color: "#ef494f",
        padding: 16
    },
    rowItemSave: {
        fontSize: 16,
        color: "rgb(64, 155, 107)",
        padding: 16
    },
    editInput: {
        flex: 1,
        fontSize: 16,
        padding: 0,
        color: "#ccc"
    }
})

/**
 * Define propTypes
 */
RowItem.propTypes = {
    text: string.isRequired,
    onItemComplete: func.isRequired,
    onItemRemove: func.isRequired,
    onUpdate: func.isRequired,
    onToggleEdit: func.isRequired,
    editing: bool
}

/**
 * Define defaultProps
 */
RowItem.defaultProps = {
    text: "",
    editing: false
}
/**
 * Export component
 */
export default RowItem;