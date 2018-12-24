import React, {PureComponent} from "react";
import {View, Text, StyleSheet, Switch} from "react-native";
import {string} from "prop-types";

class RowItem extends PureComponent {
    /**
     * Render lifecycle
     * @returns {*}
     */
    render() {
        const {text, complete} = this.props
        return (
            <View style={styles.rowItemContainer}>
                <Switch value={complete}/>
                <Text style={styles.rowItemText}>{text}</Text>
            </View>
        )
    }
}

/**
 * Define styles
 */
const styles = StyleSheet.create({
    rowItemContainer: {
        padding: 16,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between"
    },
    rowItemText: {
        fontSize: 16,
        color: "#222"
    }
})

/**
 * Define propTypes
 */
RowItem.propTypes = {
    text: string.isRequired
}

/**
 * Define defaultProps
 */
RowItem.defaultProps = {
    text: ""
}
/**
 * Export component
 */
export default RowItem;