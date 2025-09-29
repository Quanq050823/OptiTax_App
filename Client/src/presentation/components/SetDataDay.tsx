import { ColorMain } from "@/src/presentation/components/colors";
import { exportFromTemplate } from "@/src/presentation/screens/ReportExport/ExportInvoiceOutput";
import { AntDesign } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PaperProvider } from "react-native-paper";
import { DatePickerModal, registerTranslation } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

type SetDataDayProps = {
  mode?: "month" | "quarter" | "range";
  setMode: React.Dispatch<React.SetStateAction<"month" | "quarter" | "range">>;
  selectedDate?: CalendarDate;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
  range: { startDate: CalendarDate; endDate: CalendarDate };
  onDismiss: () => void;
  onConfirmSingle: (params: { date: CalendarDate }) => void;
  handleExportPDF?: () => void;
  onConfirmRange: (params: {
    startDate?: CalendarDate;
    endDate?: CalendarDate;
  }) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  getQuarter: (month: number) => number;
};
function SetDataDay({
  mode,
  setMode,
  selectedDate,
  setVisible,
  visible,
  range,
  onDismiss,
  onConfirmSingle,
  handleExportPDF,
  onConfirmRange,
  getQuarter,
  loading,
  setLoading,
}: SetDataDayProps) {
  console.log(selectedDate);

  return (
    <View
      style={{
        padding: 20,
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      {/* Selector */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 12,
          justifyContent: "space-between",
          width: "100%",
          shadowColor: ColorMain,
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: 0 },
          elevation: 10,
        }}
      >
        <TouchableOpacity
          style={[
            stytes.selectedDate,
            ,
            { backgroundColor: mode === "month" ? ColorMain : "#fff" },
          ]}
          onPress={() => setMode("month")}
        >
          <Text
            style={{
              color: mode === "month" ? "#fff" : ColorMain,
              fontWeight: "600",
            }}
          >
            Theo tháng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            stytes.selectedDate,
            ,
            { backgroundColor: mode === "quarter" ? ColorMain : "#fff" },
          ]}
          onPress={() => setMode("quarter")}
        >
          <Text
            style={{
              color: mode === "quarter" ? "#fff" : ColorMain,
              fontWeight: "600",
            }}
          >
            Theo quý
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            stytes.selectedDate,
            ,
            { backgroundColor: mode === "range" ? ColorMain : "#fff" },
          ]}
          onPress={() => setMode("range")}
        >
          <Text
            style={{
              color: mode === "range" ? "#fff" : ColorMain,
              fontWeight: "600",
            }}
          >
            Khoảng ngày
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nút chọn thời gian */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "translate",
          paddingHorizontal: 25,
          borderRadius: 10,
          marginTop: 20,
          // shadowColor: ColorMain,
          // shadowOpacity: 0.5,
          // shadowOffset: { width: 0, height: 0 },
          paddingVertical: 10,
          width: "100%",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: "#9d9d9d",
        }}
      >
        {/* Preview */}
        {selectedDate ? (
          <>
            {mode === "month" && selectedDate && (
              <TouchableOpacity style={stytes.resultSelectedDate}>
                <Text>
                  Đã chọn: Năm {new Date(selectedDate).getFullYear()},
                  Tháng&nbsp;
                  {new Date(selectedDate).getMonth() + 1}
                </Text>
              </TouchableOpacity>
            )}
            {mode === "quarter" && selectedDate && (
              <TouchableOpacity style={stytes.resultSelectedDate}>
                <Text>
                  Đã chọn: Năm {new Date(selectedDate).getFullYear()}, Quý&nbsp;
                  {getQuarter(new Date(selectedDate).getMonth() + 1)}
                </Text>
              </TouchableOpacity>
            )}
            {mode === "range" && range.startDate && range.endDate && (
              <TouchableOpacity style={stytes.resultSelectedDate}>
                <Text>
                  {new Date(range.startDate).toLocaleDateString("vi-VN")}
                  &nbsp;→&nbsp;
                  {new Date(range.endDate).toLocaleDateString("vi-VN")}
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text>Chọn ngày tháng</Text>
        )}

        <AntDesign
          name="calendar"
          size={24}
          color="black"
          onPress={() => setVisible(true)}
        />
      </View>

      {/* DatePickerModal */}
      {mode === "range" ? (
        <DatePickerModal
          locale="vi"
          mode="range"
          visible={visible}
          startDate={range.startDate}
          endDate={range.endDate}
          onDismiss={onDismiss}
          onConfirm={onConfirmRange}
        />
      ) : (
        <DatePickerModal
          locale="vi"
          mode="single"
          visible={visible}
          date={selectedDate}
          onDismiss={onDismiss}
          onConfirm={onConfirmSingle}
        />
      )}

      {/* Xuất PDF */}
    </View>
  );
}

const stytes = StyleSheet.create({
  selectedDate: {
    padding: 10,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  resultSelectedDate: {},
  btnExport: {
    padding: 10,
    backgroundColor: ColorMain,
    borderRadius: 10,
  },
});
export default SetDataDay;
