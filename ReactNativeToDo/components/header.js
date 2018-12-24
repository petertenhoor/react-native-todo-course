import React, {PureComponent} from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import {string, func} from "prop-types";

class Header extends PureComponent {

    /**
     * Render lifecycle
     * @returns {*}
     */
    render() {

        const {inputValue, onAddItem, onInputChange, onToggleAllComplete} = this.props
        const {header: headerStyles, input: inputStyles, toggleIcon: toggleIconStyles} = styles

        return (
            <View style={headerStyles}>

                <TouchableOpacity onPress={onToggleAllComplete}>
                    <Text style={toggleIconStyles}>
                        {String.fromCharCode(10003)}
                    </Text>
                </TouchableOpacity>

                <TextInput style={inputStyles}
                           value={inputValue}
                           onChangeText={onInputChange}
                           onSubmitEditing={onAddItem}
                           placeholder="What needs to be done?"
                           blurOnSubmit={false}
                           returnKeyType="done"/>

            </View>
        )
    }
}

/**
 * Define styles
 */
const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#222",
    },
    toggleIcon: {
        fontSize: 16,
        color: "#ccc",
        padding: 16
    },
    input: {
        flex: 1,
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 16,
        fontSize: 16,
        color: "#ccc"
    }
})

/**
 * Define propTypes
 */
Header.propTypes = {
    inputValue: string.isRequired,
    onAddItem: func.isRequired,
    onInputChange: func.isRequired,
    onToggleAllComplete: func.isRequired
}

/**
 * Define defaultProps
 */
Header.defaultProps = {
    inputValue: ""
}
/**
 * Export component
 */
export default Header;