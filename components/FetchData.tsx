import { ScrollArea, Table } from "@mantine/core";
import elements from "./../src/agro.json";
import { useEffect, useState } from "react";

// Defining the interface for crop data
interface CropData {
  Country: string;
  Year: string;
  "Crop Name": string;
  //Declaring the below entries 3 as 'number OR string' as these fields were missing in some of the entries in the JSON file provided.
  "Crop Production (UOM:t(Tonnes))": number | string;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": number | string;
  "Area Under Cultivation (UOM:Ha(Hectares))": number | string;
}

function FetchData() {
  // State to store processed crop data
  const [data, setData] = useState<CropData[]>([]);

  // State to store max and min production stats per year
  const [productionStats, setProductionStats] = useState<
    Map<string, { max: CropData; min: CropData }>
  >(new Map());

  // useEffect hook to process the data when the component mounts.
  useEffect(() => {
    // Processing the raw data & converting necessary fields to numbers.
    const processedData = elements.map((element: any) => ({
      ...element,
      // Converting the 'Crop Production' field to a number if it exists, otherwise null.
      "Crop Production (UOM:t(Tonnes))": element[
        "Crop Production (UOM:t(Tonnes))"
      ]
        ? parseFloat(element["Crop Production (UOM:t(Tonnes))"])
        : null,
    }));
    setData(processedData); // Update the state with processed data

    // Initializing a map to store max & min production.
    const statsMap = new Map<string, { max: CropData; min: CropData }>();

    // Iterating through processed data to determine max & min production.
    processedData.forEach((element) => {
      const year = element.Year;
      const production = element["Crop Production (UOM:t(Tonnes))"];

      if (production === null) return; // Skip entries with null production

      if (!statsMap.has(year)) {
        // If the year is not in the map, initialize it with the current element as both max & min.
        statsMap.set(year, { max: element, min: element });
      } else {
        const yearStats = statsMap.get(year)!;
        // Updating the max production if the current year's production is greater.
        if (production > yearStats.max["Crop Production (UOM:t(Tonnes))"]!) {
          yearStats.max = element;
        }
        // Updating the min production if the current year's production is less.
        if (production < yearStats.min["Crop Production (UOM:t(Tonnes))"]!) {
          yearStats.min = element;
        }
        statsMap.set(year, yearStats); // Updating the map with new stats
      }
    });

    setProductionStats(statsMap);
  }, []);

  // Generating table rows from the map
  const rows = Array.from(productionStats.entries()).map(
    ([year, { max, min }]) => (
      <Table.Tr key={year}>
        <Table.Td>{year}</Table.Td>
        <Table.Td>
          {max["Crop Name"]} ({max["Crop Production (UOM:t(Tonnes))"]} t)
        </Table.Td>
        <Table.Td>
          {min["Crop Name"]} ({min["Crop Production (UOM:t(Tonnes))"]} t)
        </Table.Td>
      </Table.Tr>
    )
  );

  //Rendering the table
  return (
    <div>
      <h2>Crop Production Statistics</h2>
      <Table.ScrollContainer minWidth={500}>
        <ScrollArea h={450}>
          <Table            
            stickyHeader
            horizontalSpacing="md"
            verticalSpacing="md"
            striped
            highlightOnHover
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Year</Table.Th>
                <Table.Th>Crop with Maximum Production</Table.Th>
                <Table.Th>Crop with Minimum Production</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Table.ScrollContainer>
    </div>
  );
}

export default FetchData;
