import React from "react";
import { Form, Input, Select, DatePicker, Button, Card } from "antd";
import "antd/dist/reset.css";

const { Option } = Select;

const JobRequestPage = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log("Form Submitted:", values);
    // You can integrate with backend API here
  };

  return (
    <div style={{ padding: "30px", background: "#f5f5f5" }}>
      <Card title="Job Request Form" style={{ maxWidth: 800, margin: "0 auto" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Job Title */}
          <Form.Item
            label="Job Title"
            name="jobTitle"
            rules={[{ required: true, message: "Please enter job title" }]}
          >
            <Input placeholder="e.g. Software Engineer" />
          </Form.Item>

          {/* Department */}
          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please select department" }]}
          >
            <Select placeholder="Select department">
              <Option value="HR">HR</Option>
              <Option value="Engineering">Engineering</Option>
              <Option value="Marketing">Marketing</Option>
              <Option value="Finance">Finance</Option>
            </Select>
          </Form.Item>

          {/* Job Type */}
          <Form.Item
            label="Job Type"
            name="jobType"
            rules={[{ required: true, message: "Please select job type" }]}
          >
            <Select placeholder="Select job type">
              <Option value="Full-time">Full-time</Option>
              <Option value="Part-time">Part-time</Option>
              <Option value="Contract">Contract</Option>
              <Option value="Internship">Internship</Option>
            </Select>
          </Form.Item>

          {/* Deadline */}
          <Form.Item
            label="Application Deadline"
            name="deadline"
            rules={[{ required: true, message: "Please select deadline" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Job Description"
            name="description"
            rules={[{ required: true, message: "Please enter job description" }]}
          >
            <Input.TextArea rows={4} placeholder="Describe the role and responsibilities" />
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default JobRequestPage;