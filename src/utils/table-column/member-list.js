export const memberListColumn = [
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "firstName",
    sorter: (a, b) => a.firstName.localeCompare(b.firstName),
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    key: "lastName",
    sorter: (a, b) => a.lastName.localeCompare(b.lastName),
  },
  {
    title: "User Name",
    dataIndex: "user_name",
    key: "userName",
    sorter: (a, b) => a.userName.localeCompare(b.userName),
  },
  {
    title: "Email",
    dataIndex: "user_email",
    key: "email",
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: "Phone Number",
    dataIndex: "phone_number",
    key: "phoneNumber",
    sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
  },
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
    sorter: (a, b) => a.company.localeCompare(b.company),
  },
  {
    title: "Password",
    dataIndex: "password",
    key: "password",
  },
  {
    title: "Actions",
    key: "actions",
    width: 150,
  },
];
