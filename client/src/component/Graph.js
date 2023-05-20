// import React from 'react';
// import { View } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';

// class GraphComponent extends React.Component {
//     render() {
//         const callGraphData = () => {
//             const channelId = "2058499";
//             const apiKey = "X4IOG5HEJPU1SJ8J";
//             const apiUrl = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=10`;

//             fetch(apiUrl)
//                 .then((response) => response.json())
//                 .then((data) => {
//                     console.log(data)
//                     // Process the data and extract the necessary values
//                     // const chartData = data.feeds.map((feed) => ({
//                     //     x: new Date(feed.created_at),
//                     //     y: parseFloat(feed.field1), // Adjust the field according to your data
//                     // }));

//                     // Pass the chartData to the graph component for rendering
//                     // this.setState({ chartData });
//                 })
//                 .catch((error) => {
//                     console.error(error);
//                 });

//         }
//     //     return (
//     //         <View>
//     //             <LineChart
//     //                 data={{
//     //                     datasets: [
//     //                         {
//     //                             data: this.props.chartData,
//     //                         },
//     //                     ],
//     //                 }}
//     //                 width={Dimensions.get('window').width} // Adjust the width as needed
//     //                 height={220}
//     //                 yAxisLabel=""
//     //                 chartConfig={{
//     //                     backgroundColor: '#ffffff',
//     //                     backgroundGradientFrom: '#ffffff',
//     //                     backgroundGradientTo: '#ffffff',
//     //                     decimalPlaces: 2,
//     //                     color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//     //                 }}
//     //                 bezier
//     //             />
//     //         </View>
//     //     );
//     // }
// }

// // export default GraphComponent;
