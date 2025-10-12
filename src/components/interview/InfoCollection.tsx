import { Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setCandidateInfo, setInterviewStatus } from "@/lib/redux/slices/interviewSlice";
import { CandidateInfo } from "@/types/interview";
import { UserIcon, EnvelopeIcon, PhoneIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const InfoCollection: React.FC = () => {
  const dispatch = useDispatch();
  const candidateInfo = useSelector((state: RootState) => state.interview.candidateInfo);
  const [form] = Form.useForm();

  const handleSubmit = (values: CandidateInfo) => {
    dispatch(setCandidateInfo(values));
    dispatch(setInterviewStatus({ status: "in-progress" }));
    message.success("Information saved! Starting your interview...");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 animate-gradient" />
      <div className="fixed inset-0 bg-gradient-to-tl from-blue-50/50 via-transparent to-pink-50/50 animate-gradient-slow" />
      
      {/* Floating gradient orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <p className="text-lg text-gray-600">
            Help us personalize your interview experience
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/70 rounded-3xl border border-white/50 shadow-2xl shadow-purple-500/10 p-8 animate-fadeIn animation-delay-200">
          <Form
            form={form}
            layout="vertical"
            initialValues={candidateInfo || {}}
            onFinish={handleSubmit}
            className="space-y-2"
          >
            <Form.Item
              name="name"
              label={<span className="text-gray-700 font-semibold">Full Name</span>}
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                  <UserIcon className="w-5 h-5" />
                </div>
                <Input
                  size="large"
                  placeholder="John Doe"
                  className="pl-12 h-12 rounded-xl border-2 border-gray-200/50 hover:border-violet-300 focus:border-violet-400 transition-all"
                />
              </div>
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="text-gray-700 font-semibold">Email Address</span>}
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                  <EnvelopeIcon className="w-5 h-5" />
                </div>
                <Input
                  size="large"
                  placeholder="john@example.com"
                  className="pl-12 h-12 rounded-xl border-2 border-gray-200/50 hover:border-violet-300 focus:border-violet-400 transition-all"
                />
              </div>
            </Form.Item>

            <Form.Item
              name="phone"
              label={<span className="text-gray-700 font-semibold">Phone Number</span>}
              rules={[{ required: true, message: "Please enter your phone number" }]}
            >
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                  <PhoneIcon className="w-5 h-5" />
                </div>
                <Input
                  size="large"
                  placeholder="+1 (555) 123-4567"
                  className="pl-12 h-12 rounded-xl border-2 border-gray-200/50 hover:border-violet-300 focus:border-violet-400 transition-all"
                />
              </div>
            </Form.Item>

            <Form.Item
              name="jobRole"
              label={<span className="text-gray-700 font-semibold">Position Applied For</span>}
            >
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                  <BriefcaseIcon className="w-5 h-5" />
                </div>
                <Input
                  size="large"
                  placeholder="Software Engineer"
                  className="pl-12 h-12 rounded-xl border-2 border-gray-200/50 hover:border-violet-300 focus:border-violet-400 transition-all"
                />
              </div>
            </Form.Item>

            <Form.Item className="mb-0 pt-4">
              <button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Interview
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default InfoCollection;