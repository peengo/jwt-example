import Vue from "vue";
import { format, parseISO } from "date-fns";
import { slugifyWithId } from "./utils/slugify";

Vue.filter("formatDate", time => format(parseISO(time), "dd MMM yyyy"));
Vue.filter("formatDateTime", time => format(parseISO(time), "dd MMM yyyy - hh:mm a"));
Vue.filter("slugifyWithId", (string, id) => slugifyWithId(string, id));