import Time "mo:core/Time";
import Int "mo:core/Int";
import Array "mo:core/Array";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";

actor {
  type Message = {
    author : Text;
    text : Text;
    timestamp : Time.Time;
  };

  module Message {
    public func compare(message1 : Message, message2 : Message) : Order.Order {
      Int.compare(message1.timestamp, message2.timestamp);
    };
  };

  let messagesList = List.empty<Message>();
  let maxMessages = 100;

  public shared ({ caller }) func postMessage(author : Text, text : Text) : async () {
    if (text.size() == 0) { Runtime.trap("Message cannot be empty") };
    if (text.size() > 500) { Runtime.trap("Message too long") };

    let message : Message = {
      author;
      text;
      timestamp = Time.now();
    };

    messagesList.add(message);

    if (messagesList.size() > maxMessages) {
      ignore messagesList.removeLast();
    };
  };

  public query ({ caller }) func getMessages() : async [Message] {
    messagesList.toArray().sort().reverse();
  };
};
