import React from "react";

function CommunityGuides() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          🛡️ Community Guidelines & Protocols
        </h1>
        <p className="mb-6 text-gray-700">
          Welcome to our community network! 🎉 To make this a safe, respectful,
          and positive space for everyone, we kindly ask all members to follow
          these simple guidelines:
        </p>

        <ul className="space-y-5 text-gray-800">
          <li>
            <strong>📌 1. Be Respectful:</strong> Treat all members with
            kindness and courtesy. Everyone is here to connect, share, and grow
            — let’s make it a welcoming experience.
          </li>
          <li>
            <strong>🗣️ 2. No Abusive Language:</strong> Strictly avoid hate
            speech, bullying, personal attacks, or the use of abusive/offensive
            language in community chats or comments. Violations may lead to
            message deletion, warnings, or even removal from the community.
          </li>
          <li>
            <strong>💬 3. Engage Constructively:</strong> Share your thoughts,
            opinions, and feedback respectfully. Disagreements are fine — just
            keep them civil.
          </li>
          <li>
            <strong>📢 4. Posting Events & Notices:</strong> Use the{" "}
            <span className="font-semibold text-blue-600">Events</span> page to
            reflect on completed activities and share experiences. Use the{" "}
            <span className="font-semibold text-blue-600">Notice</span> tab to
            post important announcements, upcoming plans, or community
            decisions.
          </li>
          <li>
            <strong>🔍 5. Join & Explore Responsibly:</strong> When joining new
            communities, make sure to read their rules and values. Don’t spam or
            promote unrelated content.
          </li>
          <li>
            <strong>❤️ 6. React With Purpose:</strong> Likes 👍 and dislikes 👎
            on event posts are meant to help improve future events. Use comments
            to encourage, appreciate, or offer constructive suggestions.
          </li>
          <li>
            <strong>👥 7. Private Info Stays Private:</strong> Don’t share
            others’ private information without consent. Report any suspicious
            behavior to community admins.
          </li>
          <li>
            <strong>🙋 8. Report Concerns:</strong> If you witness any behavior
            that violates these guidelines, don’t hesitate to report it. Our
            moderators are here to help maintain a safe space for all.
          </li>
        </ul>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-blue-700 font-medium">
          ✅ Let’s build positive communities — together.
        </div>
      </div>
    </div>
  );
}

export default CommunityGuides;
