import { ColorMain } from "@/src/presentation/components/colors";
import { useState } from "react";
import { Searchbar } from "react-native-paper";
type labelSearch = {
  label: string;
};
function SearchByName({ label }: labelSearch) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Searchbar
      placeholder={label}
      onChangeText={setSearchQuery}
      value={searchQuery}
      icon="magnify"
      style={{
        backgroundColor: "#fff",
        width: "87%",
      }}
      iconColor={ColorMain}
      placeholderTextColor={ColorMain}
      
    />
  );
}

export default SearchByName;
