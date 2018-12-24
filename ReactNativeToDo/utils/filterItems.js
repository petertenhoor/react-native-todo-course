import filterTypes from "./filterTypes";

/**
 * Filter items by completion status based on given filter key
 * @param filter {string}
 * @param items {array}
 * @returns {array}
 */
export default function (filter, items) {
    return items.filter((item) => {
        if (filter === filterTypes.ALL) return true
        if (filter === filterTypes.COMPLETED) return item.complete
        if (filter === filterTypes.ACTIVE) return !item.complete
    })
}