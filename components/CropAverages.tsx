import { Table } from "@mantine/core";
import elements from "./../src/agro.json";
import { useEffect, useState } from "react";


interface CropData {
  Country: string;
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": number | string;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": number | string;
  "Area Under Cultivation (UOM:Ha(Hectares))": number | string;
}

function CropAverages() {
  const [data, setData] = useState<CropData[]>([]);
  const [cropStats, setCropStats] = useState<Map<string, { avgYield: number, avgArea: number }>>(new Map());

  // useEffect hook to process the data when the component mounts
  useEffect(() => {
    // Processing the raw data & converting necessary fields to numbers
    const processedData = elements.map((element: any) => ({
      ...element,
      "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": element["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"] ? parseFloat(element["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]) : null,
      "Area Under Cultivation (UOM:Ha(Hectares))": element["Area Under Cultivation (UOM:Ha(Hectares))"] ? parseFloat(element["Area Under Cultivation (UOM:Ha(Hectares))"]) : null,
    }));
    setData(processedData);

    // Initializing a map to store total yields, yield counts, total area etc.
    const statsMap = new Map<string, { totalYield: number, yieldCount: number, totalArea: number, areaCount: number }>();

    // Iterating through the processed data using .forEach to get the counts for each crop
    processedData.forEach((element) => {
      const cropName = element["Crop Name"];
      const yieldOfCrops = element["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"];
      const areaUnderCultivation = element["Area Under Cultivation (UOM:Ha(Hectares))"];

      // Initializing the map entry for the crop if it doesn't exist
      if (!statsMap.has(cropName)) {
        statsMap.set(cropName, { totalYield: 0, yieldCount: 0, totalArea: 0, areaCount: 0 });
      }

      // Updating count for yield and area for the crop
      const cropStats = statsMap.get(cropName)!;
      if (yieldOfCrops !== null) {
        cropStats.totalYield += yieldOfCrops;
        cropStats.yieldCount += 1;
      }
      if (areaUnderCultivation !== null) {
        cropStats.totalArea += areaUnderCultivation;
        cropStats.areaCount += 1;
      }
      statsMap.set(cropName, cropStats);
    });

     // Calculating the average and storing them in a new map
    const finalStatsMap = new Map<string, { avgYield: number, avgArea: number }>();
    statsMap.forEach((value, key) => {
      const avgYield = value.yieldCount > 0 ? value.totalYield / value.yieldCount : 0;
      const avgArea = value.areaCount > 0 ? value.totalArea / value.areaCount : 0;
      finalStatsMap.set(key, { avgYield, avgArea });
    });

    // Setting the crop state to the calculated average
    setCropStats(finalStatsMap);
  }, []);

  // Generating table rows from the crop stats map
  const rows = Array.from(cropStats.entries()).map(([cropName, { avgYield, avgArea }]) => (
    <Table.Tr key={cropName}>
      <Table.Td>{cropName}</Table.Td>
      <Table.Td>{avgYield.toFixed(3)}</Table.Td>
      <Table.Td>{avgArea.toFixed(3)}</Table.Td>
    </Table.Tr>
  ));

  //Rendering the table
  return (
    <div>
      <h2>Average Yield and Area Under Cultivation (1950-2020)</h2>
      <Table className="table-front" stickyHeader horizontalSpacing="md" verticalSpacing="md" striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Crop Name</Table.Th>
            <Table.Th>Average Yield (Kg/Ha)</Table.Th>
            <Table.Th>Average Area Under Cultivation (Ha)</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
}

export default CropAverages;
