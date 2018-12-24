import React, {PureComponent} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {func, string, shape, number} from "prop-types";

import filterTypes from "../utils/filterTypes";

class Footer extends PureComponent {
    /**
     * Render lifecycle
     * @returns {*}
     */
    render() {
        const {onFilter, activeFilter, filterCounts} = this.props
        return (
            <View style={styles.footerContainer}>
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterItem, activeFilter === filterTypes.ALL && styles.filterActive]}
                        onPress={() => onFilter(filterTypes.ALL)}>
                        <Text>All ({filterCounts.all})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterItem, activeFilter === filterTypes.ACTIVE && styles.filterActive]}
                        onPress={() => onFilter(filterTypes.ACTIVE)}>
                        <Text>Active ({filterCounts.active})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterItem, activeFilter === filterTypes.COMPLETED && styles.filterActive]}
                        onPress={() => onFilter(filterTypes.COMPLETED)}>
                        <Text>Completed ({filterCounts.completed})</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

/**
 * Define styles
 */
const styles = StyleSheet.create({
    footerContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f5f5f5',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        flex: 1
    },
    filterItem: {
        padding: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "transparent"
    },
    filterActive: {
        borderColor: "#222"
    }
})

/**
 * Define propTypes
 */
Footer.propTypes = {
    activeFilter: string,
    onFilter: func.isRequired,
    filterCounts: shape({
        all: number,
        active: number,
        completed: number
    })
}

/**
 * Define defaultProps
 */
Footer.defaultProps = {
    activeFilter: filterTypes.ALL,
    filterCounts: {
        all: 0,
        active: 0,
        completed: 0
    }
}
/**
 * Export component
 */
export default Footer;