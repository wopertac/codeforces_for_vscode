#include <iostream>
#include <vector>

using namespace std;

void solve(){
    int n; cin >> n;
    vector<int> a(n);
    for(int i = 0; i < n; i++){
        cin >> a[i];
    }

    int j = 0;
    while (j < n && a[j] == 0){
        j ++;
    }

    if (j < n) a[j] = 1;

    j = n - 1;
    while (j >= 0 && a[j] == 0){
        j --;
    }

    if (j >= 0) a[j] = 1;

    for(int i = 0;i < n; i++){
        cout << ((a[i] == -1) ? 0 : a[i]) << " ";
    }
    cout << "\n";
}

int main(){
    int t; cin >> t;
    while (t --){
        solve();
    }
}