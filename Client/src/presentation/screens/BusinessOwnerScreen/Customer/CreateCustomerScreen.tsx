import { ColorMain } from "@/src/presentation/components/colors";
import { Customer } from "@/src/types/customer";
import { AntDesign } from "@expo/vector-icons";
import { Label } from "@react-navigation/elements";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { DatePickerModal } from "react-native-paper-dates";
import provinces from "vietnam-provinces";

const dataCustomerType = [
  {
    label: "Cá nhân",
    value: "individual",
  },
  {
    label: "Doanh nghiệp",
    value: "business",
  },
];

function CreateCustomerScreen() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWards, setSelectedWards] = useState<string | null>(null);

  const [provinceList, setProvinceList] = useState<
    { label: string; value: string }[]
  >([]);
  const [wardList, setWardList] = useState<{ label: string; value: string }[]>(
    []
  );

  const [districtList, setDistrictList] = useState<
    { label: string; value: string }[]
  >([]);

  const [newCustomer, setNewCustomer] = useState<Customer>({
    _id: "",
    ownerId: "",
    name: "",
    code: "",
    email: "",
    phoneNumber: "",
    customerType: "individual", // ✅ không để rỗng
    notes: "",
    status: "active",
    tags: [],
    totalOrders: 0,
    totalSpent: 0,
    customFields: [],
    address: undefined,
    personalInfo: {
      dateOfBirth: "",
      gender: "male", // hoặc "female", "other"
    },
    financialInfo: {
      creditLimit: 0,
      paymentTerms: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  });

  const [dateStart, setDateStart] = useState<Date | undefined>();

  const [dateEnd, setDateEnd] = useState<Date | undefined>();
  const [openModalDateStart, setOpenModalDateStart] = useState(false);

  const [openModalDateEnd, setOpenModalDateEnd] = useState(false);

  console.log(newCustomer);

  useEffect(() => {
    const provs = provinces.getProvinces(); // [{ name, code }]
    const formattedProdvince = provs.map((p: any) => ({
      label: p.name,
      value: String(p.code), // luôn cast string
    }));
    setProvinceList(formattedProdvince);

    if (!selectedProvince) {
      setDistrictList([]);
      return;
    }
    const dists = provinces.getDistricts(String(selectedProvince)); // ép sang string
    const formattedDists = dists.map((d: any) => ({
      label: d.name,
      value: String(d.code),
    }));
    setDistrictList(formattedDists);

    if (!selectedDistrict) {
      setWardList([]);
      return;
    }
    const wards = provinces.getWards(String(selectedDistrict)); // ép sang string
    const formattedWards = wards.map((w: any) => ({
      label: w.name,
      value: String(w.code),
    }));
    setWardList(formattedWards);
  }, [setProvinceList, selectedProvince, selectedDistrict]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 5, fontWeight: "700" }}>
            Họ và tên <Text style={{ color: "red" }}>*</Text>
          </Text>

          <TextInput
            placeholder="VD: Nguyen Van A"
            style={styles.input}
            onChangeText={(value) =>
              setNewCustomer((prev) => ({
                ...prev,
                name: value,
              }))
            }
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 5, fontWeight: "700" }}>Email</Text>

          <TextInput
            placeholder="VD: email@gmail.com"
            style={styles.input}
            onChangeText={(value) =>
              setNewCustomer((prev) => ({
                ...prev,
                email: value,
              }))
            }
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 5, fontWeight: "700" }}>
            Số điện thoại <Text style={{ color: "red" }}>*</Text>
          </Text>

          <TextInput
            placeholder="VD: 098xxx1234"
            style={styles.input}
            onChangeText={(value) =>
              setNewCustomer((prev) => ({
                ...prev,
                phoneNumber: value,
              }))
            }
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 5, fontWeight: "700" }}>
            Địa chỉ <Text style={{ color: "red" }}>*</Text>
          </Text>

          <View style={styles.wrProvince}>
            <Dropdown
              style={styles.dropdown}
              data={provinceList}
              labelField="label"
              valueField="value"
              placeholder="Chọn Tỉnh/ Thành phố"
              placeholderStyle={{ color: "#9d9d9d" }}
              value={selectedProvince}
              onChange={(item) => {
                // Cập nhật formData: tên + code tỉnh, reset quận
                //   setFormData((prev) => ({
                //     ...prev,
                //     address: {
                //       ...prev.address,
                //       city: item.label,
                //       cityCode: item.value,
                //       district: "",
                //       districtCode: "",
                //     },
                //   }));
                setSelectedProvince(item.value);
                setSelectedDistrict(null);
              }}
            />
          </View>
          <View style={styles.wrProvince}>
            <Dropdown
              style={styles.dropdown}
              data={districtList}
              labelField="label"
              valueField="value"
              placeholder="Chọn Quận / Huyện"
              placeholderStyle={{ color: "#9d9d9d" }}
              value={selectedDistrict}
              onChange={(item) => {
                // Cập nhật formData: tên + code tỉnh, reset quận
                //   setFormData((prev) => ({
                //     ...prev,
                //     address: {
                //       ...prev.address,
                //       city: item.label,
                //       cityCode: item.value,
                //       district: "",
                //       districtCode: "",
                //     },
                //   }));
                setSelectedDistrict(item.value);
              }}
            />

            <Dropdown
              style={styles.dropdown}
              data={wardList}
              labelField="label"
              valueField="value"
              placeholder="Chọn Phường, Xã"
              placeholderStyle={{ color: "#9d9d9d" }}
              value={selectedProvince}
              onChange={(item) => {
                // Cập nhật formData: tên + code tỉnh, reset quận
                //   setFormData((prev) => ({
                //     ...prev,
                //     address: {
                //       ...prev.address,
                //       city: item.label,
                //       cityCode: item.value,
                //       district: "",
                //       districtCode: "",
                //     },
                //   }));
                setSelectedWards(item.value);
              }}
            />
          </View>
          <View>
            <TextInput
              placeholder="Số nhà, Tên đường"
              placeholderTextColor="#9d9d9d"
              style={styles.input}
            />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ marginBottom: 5, fontWeight: "700" }}>
            Nhóm khách hàng <Text style={{ color: "red" }}>*</Text>
          </Text>

          <View style={styles.wrProvince}>
            <Dropdown
              style={styles.dropdown}
              data={dataCustomerType}
              labelField="label"
              valueField="value"
              placeholder="Chọn loại khách hàng"
              placeholderStyle={{ color: "#9d9d9d" }}
              value={selectedProvince}
              onChange={(item) => {
                setNewCustomer((prev) => ({
                  ...prev,
                  customerType: item.value,
                }));
              }}
            />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={[styles.wrProvince, { gap: 30 }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ marginBottom: 5, fontWeight: "700" }}>
                Ngày sinh
              </Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  defaultValue={new Date().toLocaleDateString("vi-VN")}
                  style={styles.input}
                />
                <TouchableOpacity
                  style={{ position: "absolute", bottom: 12, right: 10 }}
                  onPress={() => setOpenModalDateStart(true)}
                >
                  <AntDesign name="calendar" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <DatePickerModal
              locale="vi"
              mode="single"
              visible={openModalDateStart}
              date={dateStart}
              onDismiss={() => setOpenModalDateStart(false)}
              onConfirm={(params) => {
                if (!params.date) return;

                const day = String(params.date.getDate()).padStart(2, "0");
                const month = String(params.date.getMonth() + 1).padStart(
                  2,
                  "0"
                );
                const year = params.date.getFullYear();
                const formattedDate = `${day}/${month}/${year}`; // "30/09/2025"
                setOpenModalDateStart(false);
                setNewCustomer((prev) => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    dateOfBirth: formattedDate,
                  },
                }));
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ marginBottom: 5, fontWeight: "700" }}>
                Giới tính
              </Text>
              <Dropdown
                style={[styles.dropdown, { height: 30 }]}
                data={[
                  {
                    label: "nam",
                    value: "male",
                  },
                  { label: "Nữ", value: "female" },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Chọn giới tính"
                placeholderStyle={{ color: "#9d9d9d" }}
                value={newCustomer.customerType}
                onChange={(item) => {
                  setNewCustomer((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      gender: item.value as "male" | "female" | "other",
                    },
                  }));
                }}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.otherInfoTitle}>Thông tin khác</Text>

        <View style={{ flexDirection: "row", gap: 20 }}>
          <View style={{ marginTop: 20, flex: 1 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Hạn mức tín dụng
            </Text>

            <TextInput
              placeholder="VD: 50000000 đ"
              style={styles.input}
              onChangeText={(value) =>
                setNewCustomer((prev) => ({
                  ...prev,
                  name: value,
                }))
              }
            />
          </View>
          <View style={{ marginTop: 20, flex: 1 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Thời hạn thanh toán (ngày)
            </Text>

            <TextInput
              placeholder="VD: 30 ngày"
              style={styles.input}
              onChangeText={(value) =>
                setNewCustomer((prev) => ({
                  ...prev,
                  name: value,
                }))
              }
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <View style={{ marginTop: 20, flex: 1 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Trạng thái
            </Text>

            <Dropdown
              style={[styles.dropdown, { height: 30 }]}
              data={[
                {
                  label: "Hoạt động",
                  value: "active",
                },
                { label: "Không hoạt động", value: "inactive" },
              ]}
              labelField="label"
              valueField="value"
              placeholder="Chọn giới tính"
              placeholderStyle={{ color: "#9d9d9d" }}
              value={newCustomer.status}
              onChange={(item) => {
                setNewCustomer((prev) => ({
                  ...prev,
                  status: item.value,
                }));
              }}
            />
          </View>
          <View style={{ marginTop: 20, flex: 1 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Mục khách hàng
            </Text>

            <Dropdown
              style={[styles.dropdown, { height: 30 }]}
              data={[
                {
                  label: "VIP",
                  value: "active",
                },
                { label: "Không hoạt động", value: "inactive" },
              ]}
              labelField="label"
              valueField="value"
              placeholder="Chọn giới tính"
              placeholderStyle={{ color: "#9d9d9d" }}
              value={newCustomer.status}
              onChange={(item) => {
                setNewCustomer((prev) => ({
                  ...prev,
                  status: item.value,
                }));
              }}
            />
          </View>
        </View>
      </View>
      <View style={{ width: "100%", alignItems: "center", marginBottom: 50 }}>
        <TouchableOpacity style={styles.btnAddCustomer}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Lưu </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    paddingBottom: 30,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#d1d1d1",
  },
  dropdown: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    elevation: 2,
    flex: 1,

    borderWidth: 0.5,
    borderColor: "#9d9d9d",
  },
  wrProvince: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  btnAddCustomer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorMain,
    height: 40,
    width: "95%",
    borderRadius: 10,
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    elevation: 5,
  },
  otherInfoTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
});

export default CreateCustomerScreen;
