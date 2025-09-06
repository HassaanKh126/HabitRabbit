import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Toast from "react-native-toast-message";

const DayCell = ({ completed, total, date }) => {
    const rate = total > 0 ? completed / total : 0;

    const baseColor = "255, 248, 240";
    const opacity = rate === 0 ? 0.2 : rate;

    return (
        <TouchableOpacity
            style={{
                width: 19,
                height: 19,
                margin: 2.5,
                backgroundColor: `rgba(${baseColor}, ${opacity})`,
                borderRadius: 3,
            }}
            onPress={() => {
                Toast.show({
                    type: 'info',
                    text1: `${date}:  ${completed}/${total} habits`
                });
            }}
        />
    );
};

const CompletionHeatmap = ({ data, weeks = 12 }) => {
    const dataMap = {};
    data.forEach((d) => {
        dataMap[d.date] = d;
    });

    const today = new Date();
    const weeksArray = [];

    for (let w = weeks - 1; w >= 0; w--) {
        const daysArray = [];
        for (let d = 0; d < 7; d++) {
            const day = new Date(today);
            day.setDate(today.getDate() - (w * 7 + d));
            const key = day.toISOString().split("T")[0];

            const dayData = dataMap[key] || { completed: 0, total: 0 };

            daysArray.push(
                <DayCell
                    key={key}
                    date={key}
                    completed={dayData.completed}
                    total={dayData.total}
                />
            );
        }

        weeksArray.push(
            <View key={w} style={{ flexDirection: "column" }}>
                {daysArray}
            </View>
        );
    }

    return (
        <View style={{ flexDirection: "row" }}>{weeksArray}</View>
    );
};

export default CompletionHeatmap;